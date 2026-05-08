package org.example.electronics.service.admin.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.electronics.dto.request.admin.AdminLoginRequestDTO;
import org.example.electronics.dto.response.admin.AdminLoginResponseDTO;
import org.example.electronics.entity.InvalidatedTokenEntity;
import org.example.electronics.entity.StaffEntity;
import org.example.electronics.repository.InvalidatedTokenRepository;
import org.example.electronics.security.auth.admin.StaffDetails;
import org.example.electronics.security.jwt.JwtUtils;
import org.example.electronics.service.admin.AdminAuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminAuthServiceImpl implements AdminAuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    private final InvalidatedTokenRepository invalidatedTokenRepository;

    @Override
    public AdminLoginResponseDTO login(AdminLoginRequestDTO adminLoginRequestDTO) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        adminLoginRequestDTO.email(),
                        adminLoginRequestDTO.password()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtUtils.generateJwtToken(authentication);

        StaffDetails staffDetails = (StaffDetails) authentication.getPrincipal();

        Objects.requireNonNull(staffDetails, "Lỗi hệ thống: StaffDetails không được null sau khi đã xác thực thành công");

        StaffEntity staffEntity = staffDetails.staffEntity();

        return new AdminLoginResponseDTO(
                jwt,
                staffEntity.getId(),
                staffEntity.getFullName(),
                staffEntity.getEmail(),
                staffEntity.getRole().getName()
        );
    }

    @Override
    public void logout(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return;
        }

        String token = authHeader.substring(7);

        try {
            LocalDateTime expiryTime= jwtUtils.extractExpiration(token);

            String tokenId = jwtUtils.extractTokenId(token);

            InvalidatedTokenEntity invalidatedToken = InvalidatedTokenEntity.builder()
                    .id(tokenId)
                    .expiryTime(expiryTime)
                    .createdAt(LocalDateTime.now())
                    .build();

            invalidatedTokenRepository.save(invalidatedToken);
        }
        catch (Exception e) {
            log.warn("Lỗi khi xử lý logout token: {}", e.getMessage());
        }
    }
}
