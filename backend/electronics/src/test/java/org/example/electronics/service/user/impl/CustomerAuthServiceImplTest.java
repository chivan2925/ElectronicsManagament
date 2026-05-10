package org.example.electronics.service.user.impl;

import org.example.electronics.dto.request.user.auth.CustomerLoginRequestDTO;
import org.example.electronics.dto.request.user.auth.CustomerRegisterRequestDTO;
import org.example.electronics.entity.UserEntity;
import org.example.electronics.entity.enums.UserStatus;
import org.example.electronics.repository.InvalidatedTokenRepository;
import org.example.electronics.repository.UserRepository;
import org.example.electronics.security.jwt.JwtUtils;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CustomerAuthServiceImplTest {

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private InvalidatedTokenRepository invalidatedTokenRepository;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CustomerAuthServiceImpl customerAuthService;

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void loginReturnsCustomerJwtSession() {
        UserEntity user = UserEntity.builder()
                .id(1)
                .fullName("Customer One")
                .email("customer@example.com")
                .phoneNumber("0909123456")
                .username("customer")
                .hashedPassword("hashed-password")
                .status(UserStatus.ACTIVE)
                .build();
        CustomerLoginRequestDTO requestDTO = new CustomerLoginRequestDTO(
                "Customer@Example.com",
                "Password123!"
        );

        when(userRepository.findByEmailIgnoreCase("customer@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("Password123!", "hashed-password")).thenReturn(true);
        when(jwtUtils.generateJwtToken(any(Authentication.class))).thenReturn("jwt-token");

        var responseDTO = customerAuthService.login(requestDTO);

        assertEquals("jwt-token", responseDTO.accessToken());
        assertEquals("Bearer", responseDTO.tokenType());
        assertEquals(1, responseDTO.id());
        assertEquals(1, responseDTO.userId());
        assertEquals("Customer One", responseDTO.fullName());
        assertEquals("customer@example.com", responseDTO.email());
        assertEquals("0909123456", responseDTO.phone());
        assertEquals("USER", responseDTO.role());
        assertEquals(UserStatus.ACTIVE, responseDTO.status());
    }

    @Test
    void loginRejectsInvalidPassword() {
        UserEntity user = UserEntity.builder()
                .id(1)
                .fullName("Customer One")
                .email("customer@example.com")
                .username("customer")
                .hashedPassword("hashed-password")
                .status(UserStatus.ACTIVE)
                .build();
        CustomerLoginRequestDTO requestDTO = new CustomerLoginRequestDTO(
                "customer@example.com",
                "WrongPassword123!"
        );

        when(userRepository.findByEmailIgnoreCase("customer@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("WrongPassword123!", "hashed-password")).thenReturn(false);

        assertThrows(BadCredentialsException.class, () -> customerAuthService.login(requestDTO));
        verify(jwtUtils, never()).generateJwtToken(any(Authentication.class));
    }

    @Test
    void registerCreatesActiveCustomerWithoutReturningPassword() {
        CustomerRegisterRequestDTO requestDTO = new CustomerRegisterRequestDTO(
                "Nguyễn Văn A",
                "Customer.Example@example.com",
                "0909 123 456",
                "Password123!",
                "Password123!"
        );

        when(userRepository.existsByEmailIgnoreCase("customer.example@example.com")).thenReturn(false);
        when(userRepository.existsByPhoneNumber("0909123456")).thenReturn(false);
        when(userRepository.existsByUsernameIgnoreCase("customerexample")).thenReturn(false);
        when(passwordEncoder.encode("Password123!")).thenReturn("hashed-password");
        when(userRepository.save(any(UserEntity.class))).thenAnswer((invocation) -> {
            UserEntity user = invocation.getArgument(0);
            user.setId(1);
            return user;
        });

        var responseDTO = customerAuthService.register(requestDTO);

        ArgumentCaptor<UserEntity> userCaptor = ArgumentCaptor.forClass(UserEntity.class);
        verify(userRepository).save(userCaptor.capture());
        UserEntity savedUser = userCaptor.getValue();

        assertEquals(1, responseDTO.id());
        assertEquals("Nguyễn Văn A", responseDTO.fullName());
        assertEquals("customer.example@example.com", responseDTO.email());
        assertEquals("0909123456", responseDTO.phone());
        assertEquals("USER", responseDTO.role());
        assertEquals(UserStatus.ACTIVE, responseDTO.status());
        assertEquals("hashed-password", savedUser.getHashedPassword());
        assertEquals("customerexample", savedUser.getUsername());
        assertFalse(responseDTO.toString().contains("hashed-password"));
    }

    @Test
    void registerAllowsMissingPhone() {
        CustomerRegisterRequestDTO requestDTO = new CustomerRegisterRequestDTO(
                "Customer One",
                "customer@example.com",
                "",
                "Password123!",
                "Password123!"
        );

        when(userRepository.existsByEmailIgnoreCase("customer@example.com")).thenReturn(false);
        when(userRepository.existsByUsernameIgnoreCase("customer")).thenReturn(false);
        when(passwordEncoder.encode("Password123!")).thenReturn("hashed-password");
        when(userRepository.save(any(UserEntity.class))).thenAnswer((invocation) -> {
            UserEntity user = invocation.getArgument(0);
            user.setId(2);
            return user;
        });

        var responseDTO = customerAuthService.register(requestDTO);

        assertNull(responseDTO.phone());
        verify(userRepository, never()).existsByPhoneNumber(any());
    }

    @Test
    void registerRejectsMismatchedPasswordConfirmation() {
        CustomerRegisterRequestDTO requestDTO = new CustomerRegisterRequestDTO(
                "Customer One",
                "customer@example.com",
                "0909123456",
                "Password123!",
                "OtherPassword123!"
        );

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> customerAuthService.register(requestDTO)
        );

        assertEquals("Mật khẩu xác nhận không khớp", exception.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    void registerRejectsDuplicateEmail() {
        CustomerRegisterRequestDTO requestDTO = new CustomerRegisterRequestDTO(
                "Customer One",
                "customer@example.com",
                "0909123456",
                "Password123!",
                "Password123!"
        );

        when(userRepository.existsByEmailIgnoreCase("customer@example.com")).thenReturn(true);

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> customerAuthService.register(requestDTO)
        );

        assertEquals("Email này đã được sử dụng", exception.getMessage());
        verify(userRepository, never()).save(any());
    }
}
