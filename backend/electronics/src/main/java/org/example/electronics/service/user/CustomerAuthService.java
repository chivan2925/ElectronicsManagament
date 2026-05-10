package org.example.electronics.service.user;

import org.example.electronics.dto.request.user.auth.CustomerRegisterRequestDTO;
import org.example.electronics.dto.request.user.auth.CustomerLoginRequestDTO;
import org.example.electronics.dto.response.user.auth.CustomerLoginResponseDTO;
import org.example.electronics.dto.response.user.auth.CustomerRegisterResponseDTO;

public interface CustomerAuthService {

    CustomerLoginResponseDTO login(CustomerLoginRequestDTO requestDTO);

    CustomerRegisterResponseDTO register(CustomerRegisterRequestDTO requestDTO);

    void logout(String authHeader);
}
