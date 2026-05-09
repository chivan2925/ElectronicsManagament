package org.example.electronics.service.admin.impl;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.example.electronics.dto.request.admin.status.AdminUpdateReturnRequestStatusRequestDTO;
import org.example.electronics.dto.response.admin.returnrequest.AdminDetailReturnRequestResponseDTO;
import org.example.electronics.dto.response.admin.returnrequest.AdminReturnRequestResponseDTO;
import org.example.electronics.entity.ReturnRequestEntity;
import org.example.electronics.entity.enums.DateFilterType;
import org.example.electronics.entity.enums.ReturnRequestStatus;
import org.example.electronics.mapper.ReturnRequestMapper;
import org.example.electronics.repository.ReturnRequestRepository;
import org.example.electronics.repository.StaffRepository;
import org.example.electronics.service.admin.AdminPaymentTransactionService;
import org.example.electronics.service.admin.AdminReturnRequestService;
import org.example.electronics.service.admin.AdminWarehouseTransactionService;
import org.example.electronics.util.DateTimeUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AdminReturnRequestServiceImpl implements AdminReturnRequestService {

    private final ReturnRequestMapper returnRequestMapper;
    private final ReturnRequestRepository returnRequestRepository;

    private final StaffRepository staffRepository;

    private final AdminWarehouseTransactionService adminWarehouseTransactionService;

    private final AdminPaymentTransactionService adminPaymentTransactionService;

    private static final Map<ReturnRequestStatus, Set<ReturnRequestStatus>> ALLOWED_STATUS_TRANSITIONS = Map.of(
            ReturnRequestStatus.PENDING, Set.of(ReturnRequestStatus.APPROVED, ReturnRequestStatus.REJECTED),
            ReturnRequestStatus.APPROVED, Set.of(ReturnRequestStatus.COMPLETED),

            ReturnRequestStatus.COMPLETED, Set.of(),
            ReturnRequestStatus.REJECTED, Set.of()
    );

    @Transactional
    @Override
    public AdminReturnRequestResponseDTO updateStatusReturnRequest(Integer returnRequestId, AdminUpdateReturnRequestStatusRequestDTO requestDTO, Integer staffId) {
        ReturnRequestEntity existingReturnRequestEntity = returnRequestRepository.findById(returnRequestId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Không tìm thấy yêu cầu trả hàng với id: " + returnRequestId
                ));

        checkReturnRequestEditable(existingReturnRequestEntity);

        validateStatusTransition(existingReturnRequestEntity, requestDTO);

        existingReturnRequestEntity.setStatus(requestDTO.status());
        existingReturnRequestEntity.setHandledByStaff(staffRepository.getReferenceById(staffId));

        switch (requestDTO.status()) {
            case COMPLETED:
                existingReturnRequestEntity.setResolvedAt(LocalDateTime.now());

                adminWarehouseTransactionService.autoCreateReturnWarehouseTransactionForReturnRequest(existingReturnRequestEntity, staffId);

                adminPaymentTransactionService.processRefund(returnRequestId, staffId);

                break;

            case REJECTED:
                existingReturnRequestEntity.setResolvedAt(LocalDateTime.now());

                break;

            default:
                break;
        }

        return returnRequestMapper.toAdminResponseDTO(existingReturnRequestEntity);
    }

    @Transactional(readOnly = true)
    @Override
    public Page<AdminReturnRequestResponseDTO> getAllReturnRequests(String keyword, ReturnRequestStatus status, DateFilterType dateType, LocalDate fromDate, LocalDate toDate, Pageable pageable) {
        LocalDateTime startDateTime = DateTimeUtils.getStartOfDay(fromDate);
        LocalDateTime endDateTime = DateTimeUtils.getEndOfDay(toDate);

        String finalKeyword = StringUtils.hasText(keyword) ? keyword.trim() : null;

        String typeString = dateType != null ? dateType.name() : DateFilterType.CREATED_AT.name();

        Page<ReturnRequestEntity> returnRequestEntityPage = returnRequestRepository.findAllReturnRequestsWithFilter(finalKeyword, status, typeString, startDateTime, endDateTime, pageable);

        return returnRequestEntityPage.map(returnRequestMapper::toAdminResponseDTO);
    }

    @Transactional(readOnly = true)
    @Override
    public AdminDetailReturnRequestResponseDTO getReturnRequestById(Integer id) {
        ReturnRequestEntity existingReturnRequestEntity = returnRequestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Không tìm thấy yêu cầu trả hàng với id: " + id
                ));

        return returnRequestMapper.toAdminDetailResponseDTO(existingReturnRequestEntity);
    }

    private void validateStatusTransition(ReturnRequestEntity currentReturnRequest, AdminUpdateReturnRequestStatusRequestDTO requestDTO) {
        ReturnRequestStatus currentStatus = currentReturnRequest.getStatus();
        ReturnRequestStatus newStatus = requestDTO.status();

        if (currentStatus == newStatus) {
            return;
        }

        Set<ReturnRequestStatus> allowedNextStatus = ALLOWED_STATUS_TRANSITIONS.getOrDefault(currentStatus, Set.of());

        if (!allowedNextStatus.contains(newStatus)) {
            throw new IllegalArgumentException(
                    String.format("Chuyển đổi trạng thái không hợp lệ, không thể chuyển từ '%s' sang '%s'", currentStatus, newStatus)
            );
        }
    }

    private void checkReturnRequestEditable(ReturnRequestEntity returnRequest) {
        if (returnRequest.getStatus() != ReturnRequestStatus.PENDING) {
            throw new IllegalStateException(
                    "Không thể chỉnh sửa! Yêu cầu trả hàng đang ở trạng thái " + returnRequest.getStatus() + ". Chỉ được phép sửa khi đang PENDING."
            );
        }
    }
}
