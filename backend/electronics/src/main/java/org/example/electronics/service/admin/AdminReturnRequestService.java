package org.example.electronics.service.admin;

import org.example.electronics.dto.request.admin.status.AdminUpdateReturnRequestStatusRequestDTO;
import org.example.electronics.dto.response.admin.returnrequest.AdminDetailReturnRequestResponseDTO;
import org.example.electronics.dto.response.admin.returnrequest.AdminReturnRequestResponseDTO;
import org.example.electronics.entity.enums.DateFilterType;
import org.example.electronics.entity.enums.ReturnRequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

public interface AdminReturnRequestService {

    AdminReturnRequestResponseDTO updateStatusReturnRequest(Integer returnRequestId, AdminUpdateReturnRequestStatusRequestDTO requestDTO, Integer staffId);

    Page<AdminReturnRequestResponseDTO> getAllReturnRequests(String keyword, ReturnRequestStatus status, DateFilterType dateType, LocalDate fromDate, LocalDate toDate, Pageable pageable);

    AdminDetailReturnRequestResponseDTO getReturnRequestById(Integer id);
}
