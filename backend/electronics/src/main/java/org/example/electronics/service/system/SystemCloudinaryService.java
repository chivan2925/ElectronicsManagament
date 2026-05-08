package org.example.electronics.service.system;

import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

public interface SystemCloudinaryService {

    Map<String, String> uploadImage(MultipartFile file);

    void deleteImage(String publicId);
}
