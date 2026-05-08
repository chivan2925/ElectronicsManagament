package org.example.electronics.service.admin;

import org.example.electronics.dto.request.admin.AdminLoginRequestDTO;
import org.example.electronics.dto.response.admin.AdminLoginResponseDTO;

public interface AdminAuthService {

    AdminLoginResponseDTO login(AdminLoginRequestDTO adminLoginRequestDTO);

    void logout(String authHeader);
}
