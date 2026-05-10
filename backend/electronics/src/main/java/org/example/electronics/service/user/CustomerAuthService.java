package org.example.electronics.service.user;

import org.example.electronics.dto.request.user.auth.CustomerRegisterRequestDTO;
import org.example.electronics.dto.response.user.auth.CustomerRegisterResponseDTO;

public interface CustomerAuthService {

    CustomerRegisterResponseDTO register(CustomerRegisterRequestDTO requestDTO);
}
