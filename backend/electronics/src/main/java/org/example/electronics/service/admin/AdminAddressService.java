package org.example.electronics.service.admin;

import org.example.electronics.dto.response.admin.AdminAddressResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminAddressService {

    Page<AdminAddressResponseDTO> getAllAddressesByUserId(Integer userId, Pageable pageable);
}
