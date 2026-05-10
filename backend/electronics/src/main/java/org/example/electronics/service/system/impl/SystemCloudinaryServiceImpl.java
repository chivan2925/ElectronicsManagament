package org.example.electronics.service.system.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.electronics.service.system.SystemCloudinaryService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class SystemCloudinaryServiceImpl implements SystemCloudinaryService {

    private static final long MAX_IMAGE_BYTES = 5L * 1024L * 1024L;
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of("image/jpeg", "image/png", "image/webp");
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("jpg", "jpeg", "png", "webp");

    private final Cloudinary cloudinary;

    /**
     * Upload ảnh lên Cloudinary
     * @return Map chứa "url" (link ảnh) và "publicId" (mã để xóa ảnh sau này)
     */
    public Map<String, String> uploadImage(MultipartFile file) {
        try {
            validateImageUpload(file);

            // 2. Bơm lên Cloudinary, nhét vào folder "electronics_store" cho gọn
            // 🚀 ĐÃ SỬA: Dùng Map.of() của Java thay vì ObjectUtils.asMap() để tránh warning Raw Type
            Map<String, Object> options = Map.of(
                    "allowed_formats", List.of("jpg", "jpeg", "png", "webp"),
                    "folder", "electronics_store",
                    "overwrite", false,
                    "resource_type", "image",
                    "unique_filename", true,
                    "use_filename", false
            );

            // 🚀 ĐÃ SỬA: Đổi Map thành Map<?, ?> để dập tắt warning "Raw use of parameterized class"
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), options);

            // 3. Lấy link an toàn (https) và mã định danh
            String secureUrl = uploadResult.get("secure_url").toString();
            String publicId = uploadResult.get("public_id").toString();

            log.info("✅ Upload ảnh thành công: {}", secureUrl);

            return Map.of(
                    "imageUrl", secureUrl,
                    "publicId", publicId
            );
        } catch (IOException e) {
            log.error("❌ Lỗi khi upload ảnh lên Cloudinary: ", e);
            throw new RuntimeException("Không thể upload ảnh vào lúc này. Vui lòng thử lại sau!");
        }
    }

    private void validateImageUpload(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File upload không được để trống.");
        }

        if (file.getSize() > MAX_IMAGE_BYTES) {
            throw new IllegalArgumentException("Kích thước ảnh không được vượt quá 5MB.");
        }

        String contentType = file.getContentType() == null ? "" : file.getContentType().toLowerCase(Locale.ROOT);
        if (!ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("Chỉ hỗ trợ ảnh JPG, PNG hoặc WEBP.");
        }

        String extension = getFileExtension(file.getOriginalFilename());
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new IllegalArgumentException("Phần mở rộng file không hợp lệ. Chỉ hỗ trợ JPG, PNG hoặc WEBP.");
        }

        byte[] header = file.getInputStream().readNBytes(12);
        if (!matchesAllowedImageSignature(header)) {
            throw new IllegalArgumentException("Nội dung file không khớp định dạng ảnh được hỗ trợ.");
        }
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.isBlank()) {
            return "";
        }

        int lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex < 0 || lastDotIndex == fileName.length() - 1) {
            return "";
        }

        return fileName.substring(lastDotIndex + 1).toLowerCase(Locale.ROOT);
    }

    private boolean matchesAllowedImageSignature(byte[] header) {
        return isJpeg(header) || isPng(header) || isWebp(header);
    }

    private boolean isJpeg(byte[] header) {
        return header.length >= 3 &&
                (header[0] & 0xff) == 0xff &&
                (header[1] & 0xff) == 0xd8 &&
                (header[2] & 0xff) == 0xff;
    }

    private boolean isPng(byte[] header) {
        return header.length >= 8 &&
                (header[0] & 0xff) == 0x89 &&
                header[1] == 0x50 &&
                header[2] == 0x4e &&
                header[3] == 0x47 &&
                header[4] == 0x0d &&
                header[5] == 0x0a &&
                header[6] == 0x1a &&
                header[7] == 0x0a;
    }

    private boolean isWebp(byte[] header) {
        return header.length >= 12 &&
                header[0] == 0x52 &&
                header[1] == 0x49 &&
                header[2] == 0x46 &&
                header[3] == 0x46 &&
                header[8] == 0x57 &&
                header[9] == 0x45 &&
                header[10] == 0x42 &&
                header[11] == 0x50;
    }

    /**
     * Xóa ảnh trên Cloudinary (Dùng khi Admin xóa sản phẩm hoặc đổi ảnh mới)
     */
    public void deleteImage(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            log.info("🗑️ Đã xóa ảnh trên Cloudinary với public_id: {}", publicId);
        } catch (IOException e) {
            log.error("❌ Lỗi khi xóa ảnh trên Cloudinary: ", e);
        }
    }
}
