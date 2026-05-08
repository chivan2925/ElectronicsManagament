package org.example.electronics.service.system.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.electronics.service.system.SystemCloudinaryService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class SystemCloudinaryServiceImpl implements SystemCloudinaryService {

    private final Cloudinary cloudinary;

    /**
     * Upload ảnh lên Cloudinary
     * @return Map chứa "url" (link ảnh) và "publicId" (mã để xóa ảnh sau này)
     */
    public Map<String, String> uploadImage(MultipartFile file) {
        try {
            // 1. Chặn vòng gửi xe nếu không phải file ảnh
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new IllegalArgumentException("Định dạng không hợp lệ! Chỉ cho phép upload file ảnh (JPG, PNG,...).");
            }

            // 2. Bơm lên Cloudinary, nhét vào folder "electronics_store" cho gọn
            // 🚀 ĐÃ SỬA: Dùng Map.of() của Java thay vì ObjectUtils.asMap() để tránh warning Raw Type
            Map<String, Object> options = Map.of(
                    "folder", "electronics_store",
                    "resource_type", "image"
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
