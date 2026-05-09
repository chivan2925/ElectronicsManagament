package org.example.electronics.controller.admin;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.electronics.dto.request.admin.warehouse.AdminUpdateWarehouseStatusRequestDTO;
import org.example.electronics.dto.request.admin.warehouse.AdminWarehouseRequestDTO;
import org.example.electronics.dto.response.admin.warehouse.AdminWarehouseResponseDTO;
import org.example.electronics.entity.enums.DateFilterType;
import org.example.electronics.entity.enums.WarehouseStatus;
import org.example.electronics.service.admin.AdminWarehouseService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin/warehouses")
@RequiredArgsConstructor
@Tag(
        name = "2. Admin Warehouse",
        description = "Các API quản lý Kho hàng và Tồn kho (Thêm/Sửa/Xóa/Danh sách). Dành riêng cho Ban quản trị."
)
public class AdminWarehouseController {

    private final AdminWarehouseService adminWarehouseService;

    @PostMapping
    @Operation(
            summary = "Tạo mới kho hàng",
            description = "Tạo một kho hàng mới, cho phép truyền kèm danh sách các sản phẩm (variant) có sẵn vào kho ngay lúc tạo."
    )
    public ResponseEntity<AdminWarehouseResponseDTO> createWarehouse(
            @Valid @RequestBody AdminWarehouseRequestDTO adminWarehouseRequestDTO
    ) {
        AdminWarehouseResponseDTO adminWarehouseResponseDTO = adminWarehouseService.createWarehouse(adminWarehouseRequestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(adminWarehouseResponseDTO);
    }

    @PutMapping("/{warehouseId}")
    @Operation(
            summary = "Cập nhật thông tin và hàng hóa của kho",
            description = "Cập nhật thông tin cơ bản của kho. Hệ thống sẽ sử dụng thuật toán Merge List để đồng bộ lại danh sách sản phẩm (Thêm mới/Cập nhật số lượng/Xóa khỏi kho) dựa trên JSON gửi lên."
    )
    public ResponseEntity<AdminWarehouseResponseDTO> updateWarehouse(
            @PathVariable Integer warehouseId,
            @Valid @RequestBody AdminWarehouseRequestDTO adminWarehouseRequestDTO
    ) {
        AdminWarehouseResponseDTO adminWarehouseResponseDTO = adminWarehouseService.updateWarehouse(warehouseId, adminWarehouseRequestDTO);

        return ResponseEntity.ok(adminWarehouseResponseDTO);
    }

    @PatchMapping("/{warehouseId}")
    @Operation(
            summary = "Thay đổi trạng thái kho",
            description = "API nhẹ dùng để bật/tắt trạng thái (ACTIVE/INACTIVE) của kho hàng mà không ảnh hưởng tới dữ liệu hàng hóa."
    )
    public ResponseEntity<AdminWarehouseResponseDTO> updateStatusWarehouse(
            @PathVariable Integer warehouseId,
            @Valid @RequestBody AdminUpdateWarehouseStatusRequestDTO adminUpdateWarehouseStatusRequestDTO
    ) {
        AdminWarehouseResponseDTO adminWarehouseResponseDTO = adminWarehouseService.updateStatusWarehouse(warehouseId, adminUpdateWarehouseStatusRequestDTO);

        return ResponseEntity.ok(adminWarehouseResponseDTO);
    }

    @DeleteMapping("/{warehouseId}")
    @Operation(
            summary = "Xóa (Mềm) kho hàng",
            description = "Chuyển trạng thái kho hàng sang DELETED. Dữ liệu vật lý vẫn được giữ lại dưới Database để phục vụ đối soát."
    )
    public ResponseEntity<AdminWarehouseResponseDTO> deleteWarehouse(
            @PathVariable Integer warehouseId
    ) {
        adminWarehouseService.deleteWarehouse(warehouseId);

        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @Operation(
            summary = "Lấy danh sách kho hàng (Phân trang)",
            description = "Trả về danh sách kho hàng. Hỗ trợ tìm kiếm theo ID hoặc Tên (keyword), lọc theo trạng thái (status) và khoảng thời gian tạo (fromDate - toDate)."
    )
    public ResponseEntity<Page<AdminWarehouseResponseDTO>> getAllWarehouses(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) WarehouseStatus status,
            @RequestParam(defaultValue = "CREATED_AT") DateFilterType dateType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @PageableDefault(sort = "updatedAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<AdminWarehouseResponseDTO> adminWarehouseResponseDTOPage = adminWarehouseService.getAllWarehouses(keyword, status, dateType, fromDate, toDate, pageable);

        return ResponseEntity.ok(adminWarehouseResponseDTOPage);
    }

    @GetMapping("/{warehouseId}")
    @Operation(
            summary = "Xem chi tiết một kho hàng",
            description = "Lấy toàn bộ thông tin cơ sở và danh sách chi tiết từng món hàng (số lượng tồn) đang có trong kho này."
    )
    public ResponseEntity<AdminWarehouseResponseDTO> getWarehouseById(
            @PathVariable Integer warehouseId
    ) {
        AdminWarehouseResponseDTO adminWarehouseResponseDTO = adminWarehouseService.getWarehouseById(warehouseId);

        return ResponseEntity.ok(adminWarehouseResponseDTO);
    }
}
