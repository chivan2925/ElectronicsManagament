package org.example.electronics.service.user.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.electronics.dto.request.user.auth.CustomerLoginRequestDTO;
import org.example.electronics.dto.request.user.auth.CustomerRegisterRequestDTO;
import org.example.electronics.dto.response.user.auth.CustomerLoginResponseDTO;
import org.example.electronics.dto.response.user.auth.CustomerRegisterResponseDTO;
import org.example.electronics.entity.InvalidatedTokenEntity;
import org.example.electronics.entity.UserEntity;
import org.example.electronics.entity.enums.GenderType;
import org.example.electronics.entity.enums.UserStatus;
import org.example.electronics.monitoring.MonitoringLogger;
import org.example.electronics.repository.InvalidatedTokenRepository;
import org.example.electronics.repository.UserRepository;
import org.example.electronics.security.auth.user.CustomerDetails;
import org.example.electronics.security.jwt.JwtUtils;
import org.example.electronics.service.user.CustomerAuthService;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.Locale;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomerAuthServiceImpl implements CustomerAuthService {

    private static final String CUSTOMER_ROLE = "USER";
    private static final int USERNAME_MAX_LENGTH = 25;

    private final InvalidatedTokenRepository invalidatedTokenRepository;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    @Override
    public CustomerLoginResponseDTO login(CustomerLoginRequestDTO requestDTO) {
        String email = requestDTO.email().trim().toLowerCase(Locale.ROOT);
        String maskedEmail = MonitoringLogger.maskEmail(email);
        MonitoringLogger.info(log, "customer.auth.login.attempt", MonitoringLogger.fields("email", maskedEmail));

        UserEntity user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> {
                    MonitoringLogger.warn(log, "customer.auth.login.failure", MonitoringLogger.fields(
                            "email", maskedEmail,
                            "reason", "not_found"
                    ));
                    return new BadCredentialsException("Email hoặc mật khẩu không đúng");
                });

        if (!passwordEncoder.matches(requestDTO.password(), user.getHashedPassword())) {
            MonitoringLogger.warn(log, "customer.auth.login.failure", MonitoringLogger.fields(
                    "email", maskedEmail,
                    "reason", "bad_credentials"
            ));
            throw new BadCredentialsException("Email hoặc mật khẩu không đúng");
        }

        if (user.getStatus() == UserStatus.DELETED) {
            throw new LockedException("Tài khoản khách hàng đã bị khóa");
        }

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new DisabledException("Tài khoản khách hàng chưa được kích hoạt");
        }

        CustomerDetails customerDetails = new CustomerDetails(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                customerDetails,
                null,
                customerDetails.getAuthorities()
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        MonitoringLogger.info(log, "customer.auth.login.success", MonitoringLogger.fields(
                "email", maskedEmail,
                "userId", user.getId()
        ));

        return new CustomerLoginResponseDTO(
                jwt,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getStatus()
        );
    }

    @Transactional
    @Override
    public CustomerRegisterResponseDTO register(CustomerRegisterRequestDTO requestDTO) {
        validatePasswordConfirmation(requestDTO);

        String fullName = requestDTO.fullName().trim();
        String email = requestDTO.email().trim().toLowerCase(Locale.ROOT);
        String phone = normalizeOptionalPhone(requestDTO.phone());

        validateUniqueIdentity(email, phone);

        UserEntity user = UserEntity.builder()
                .fullName(fullName)
                .gender(GenderType.PREFER_NOT_TO_SAY)
                .username(generateUniqueUsername(email))
                .email(email)
                .phoneNumber(phone)
                .hashedPassword(passwordEncoder.encode(requestDTO.password()))
                .status(UserStatus.ACTIVE)
                .build();

        UserEntity savedUser = userRepository.save(user);

        return toRegisterResponse(savedUser);
    }

    @Override
    public void logout(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            MonitoringLogger.warn(log, "customer.auth.logout.invalid_request", MonitoringLogger.fields(
                    "reason", "missing_bearer_token"
            ));
            return;
        }

        String token = authHeader.substring(7);

        try {
            LocalDateTime expiryTime = jwtUtils.extractExpiration(token);
            String tokenId = jwtUtils.extractTokenId(token);

            InvalidatedTokenEntity invalidatedToken = InvalidatedTokenEntity.builder()
                    .id(tokenId)
                    .expiryTime(expiryTime)
                    .createdAt(LocalDateTime.now())
                    .build();

            invalidatedTokenRepository.save(invalidatedToken);
            MonitoringLogger.info(log, "customer.auth.logout.success", MonitoringLogger.fields(
                    "expiresAt", expiryTime,
                    "tokenId", tokenId
            ));
        } catch (Exception exception) {
            MonitoringLogger.warn(log, "customer.auth.logout.failure", MonitoringLogger.fields(
                    "exception", exception.getClass().getSimpleName(),
                    "message", exception.getMessage()
            ), exception);
        }
    }

    private void validatePasswordConfirmation(CustomerRegisterRequestDTO requestDTO) {
        if (!Objects.equals(requestDTO.password(), requestDTO.confirmPassword())) {
            throw new IllegalArgumentException("Mật khẩu xác nhận không khớp");
        }
    }

    private void validateUniqueIdentity(String email, String phone) {
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new IllegalArgumentException("Email này đã được sử dụng");
        }

        if (phone != null && userRepository.existsByPhoneNumber(phone)) {
            throw new IllegalArgumentException("Số điện thoại này đã được sử dụng");
        }
    }

    private String normalizeOptionalPhone(String phone) {
        if (!StringUtils.hasText(phone)) {
            return null;
        }

        String digits = phone.replaceAll("[^0-9]", "");

        if (digits.startsWith("84") && digits.length() == 11) {
            digits = "0" + digits.substring(2);
        }

        if (digits.length() != 10) {
            throw new IllegalArgumentException("Số điện thoại cần có 10 chữ số");
        }

        return digits;
    }

    private String generateUniqueUsername(String email) {
        String localPart = email.substring(0, email.indexOf('@'));
        String baseUsername = localPart
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]", "");

        if (!StringUtils.hasText(baseUsername)) {
            baseUsername = "user";
        }

        baseUsername = trimToUsernameLength(baseUsername);
        String candidate = baseUsername;
        int suffix = 1;

        while (userRepository.existsByUsernameIgnoreCase(candidate)) {
            String suffixText = String.valueOf(suffix++);
            int prefixLength = Math.max(1, USERNAME_MAX_LENGTH - suffixText.length());
            candidate = trimToUsernameLength(baseUsername, prefixLength) + suffixText;
        }

        return candidate;
    }

    private String trimToUsernameLength(String value) {
        return trimToUsernameLength(value, USERNAME_MAX_LENGTH);
    }

    private String trimToUsernameLength(String value, int maxLength) {
        return value.length() <= maxLength ? value : value.substring(0, maxLength);
    }

    private CustomerRegisterResponseDTO toRegisterResponse(UserEntity user) {
        return new CustomerRegisterResponseDTO(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhoneNumber(),
                CUSTOMER_ROLE,
                user.getStatus()
        );
    }
}
