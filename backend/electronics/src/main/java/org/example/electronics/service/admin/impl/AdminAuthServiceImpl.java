package org.example.electronics.service.admin.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.electronics.dto.request.admin.AdminLoginRequestDTO;
import org.example.electronics.dto.response.admin.AdminLoginResponseDTO;
import org.example.electronics.entity.InvalidatedTokenEntity;
import org.example.electronics.entity.StaffEntity;
import org.example.electronics.monitoring.MonitoringLogger;
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
        String maskedEmail = MonitoringLogger.maskEmail(adminLoginRequestDTO.email());
        MonitoringLogger.info(log, "auth.login.attempt", MonitoringLogger.fields("email", maskedEmail));

        Authentication authentication;

        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            adminLoginRequestDTO.email(),
                            adminLoginRequestDTO.password()
                    )
            );
        } catch (RuntimeException exception) {
            MonitoringLogger.warn(log, "auth.login.failure", MonitoringLogger.fields(
                    "email", maskedEmail,
                    "exception", exception.getClass().getSimpleName(),
                    "message", exception.getMessage()
            ));
            throw exception;
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtUtils.generateJwtToken(authentication);

        StaffDetails staffDetails = (StaffDetails) authentication.getPrincipal();

        Objects.requireNonNull(staffDetails, "Lỗi hệ thống: StaffDetails không được null sau khi đã xác thực thành công");

        StaffEntity staffEntity = staffDetails.staffEntity();

        MonitoringLogger.info(log, "auth.login.success", MonitoringLogger.fields(
                "email", MonitoringLogger.maskEmail(staffEntity.getEmail()),
                "role", staffEntity.getRole() == null ? null : staffEntity.getRole().getName(),
                "staffId", staffEntity.getId()
        ));

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
            MonitoringLogger.warn(log, "auth.logout.invalid_request", MonitoringLogger.fields(
                    "reason", "missing_bearer_token"
            ));
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
            MonitoringLogger.info(log, "auth.logout.success", MonitoringLogger.fields(
                    "expiresAt", expiryTime,
                    "tokenId", tokenId
            ));
        }
        catch (Exception e) {
            MonitoringLogger.warn(log, "auth.logout.failure", MonitoringLogger.fields(
                    "exception", e.getClass().getSimpleName(),
                    "message", e.getMessage()
            ), e);
        }
    }
}
