package org.example.electronics.service.admin.impl;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.example.electronics.dto.response.admin.AdminAddressResponseDTO;
import org.example.electronics.entity.AddressEntity;
import org.example.electronics.mapper.AddressMapper;
import org.example.electronics.repository.AddressRepository;
import org.example.electronics.repository.UserRepository;
import org.example.electronics.service.admin.AdminAddressService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminAddressServiceImpl implements AdminAddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final AddressMapper addressMapper;

    @Transactional(readOnly = true)
    @Override
    public Page<AdminAddressResponseDTO> getAllAddressesByUserId(Integer userId, Pageable pageable) {
        if (!userRepository.existsById(userId)) {
            throw new EntityNotFoundException("Không tìm thấy User với id: " + userId);
        }

        Page<AddressEntity> addressEntityPage = addressRepository.findByUser_Id(userId, pageable);

        return addressEntityPage.map(addressMapper::toAdminResponseDTO);
    }
}
