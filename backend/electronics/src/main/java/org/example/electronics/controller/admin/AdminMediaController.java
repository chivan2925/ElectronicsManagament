package org.example.electronics.controller.admin;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.electronics.dto.request.admin.media.AdminAddMediaRequestDTO;
import org.example.electronics.dto.request.admin.media.AdminUpdateMediaOrderRequestDTO;
import org.example.electronics.dto.response.admin.AdminMediaResponseDTO;
import org.example.electronics.service.admin.AdminMediaService;
import org.example.electronics.service.system.impl.SystemCloudinaryServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/media")
@RequiredArgsConstructor
@Tag(
        name = "8. Media Management",
        description = "Các API dành cho Admin để quản lý hình ảnh độc lập (Thêm, Xóa, Đổi vị trí, Chọn ảnh bìa)."
)
public class AdminMediaController {

    private final AdminMediaService adminMediaService;

    private final SystemCloudinaryServiceImpl cloudinaryService;

    @PostMapping
    @Operation(
            summary = "Thêm mới 1 hình ảnh (Standalone)",
            description = "Thêm một bức ảnh vào Sản phẩm (truyền productId) HOẶC Biến thể (truyền variantId). Hệ thống sẽ tự động bắt lỗi nếu truyền cả 2 hoặc không truyền ID nào."
    )
    public ResponseEntity<AdminMediaResponseDTO> addMedia(
            @Valid @RequestBody AdminAddMediaRequestDTO adminAddMediaRequestDTO
    ) {
        AdminMediaResponseDTO adminMediaResponseDTO = adminMediaService.addMedia(adminAddMediaRequestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(adminMediaResponseDTO);
    }

    @DeleteMapping("/{mediaId}")
    @Operation(
            summary = "Xóa cứng (Hard Delete) hình ảnh",
            description = "Xóa vĩnh viễn hình ảnh khỏi cơ sở dữ liệu. Cảnh báo: Thao tác này là Hard Delete, không thể hoàn tác."
    )
    public ResponseEntity<Void> deleteMedia(
            @PathVariable Integer mediaId
    ) {
        adminMediaService.deleteMedia(mediaId);

        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{mediaId}/primary")
    @Operation(
            summary = "Đặt làm Ảnh đại diện (Primary)",
            description = "Phong vương cho bức ảnh này thành ảnh bìa. Hệ thống sẽ TỰ ĐỘNG chuyển isPrimary về false các bức ảnh khác cùng Sản phẩm/Biến thể."
    )
    public ResponseEntity<Void> setPrimaryMedia(
            @PathVariable Integer mediaId
    ) {
        adminMediaService.setPrimaryMedia(mediaId);

        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{mediaId}/order")
    @Operation(
            summary = "Cập nhật thứ tự hiển thị (Drag & Drop)",
            description = "Dùng khi Admin kéo thả ảnh trên giao diện. Chỉ cập nhật duy nhất thuộc tính displayOrder của bức ảnh tương ứng."
    )
    public ResponseEntity<AdminMediaResponseDTO> updateMediaOrder(
            @PathVariable Integer mediaId,
            @Valid @RequestBody AdminUpdateMediaOrderRequestDTO adminUpdateMediaOrderRequestDTO
    ) {
        AdminMediaResponseDTO adminMediaResponseDTO = adminMediaService.updateMediaOrder(mediaId, adminUpdateMediaOrderRequestDTO);

        return ResponseEntity.ok(adminMediaResponseDTO);
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        // Gọi Service up lên Cloudinary, nhận về cái Map chứa "url" và "publicId"
        Map<String, String> result = cloudinaryService.uploadImage(file);

        // Trả thẳng JSON về cho Frontend
        return ResponseEntity.ok(result);
    }
}
