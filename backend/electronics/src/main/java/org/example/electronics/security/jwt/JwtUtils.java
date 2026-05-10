package org.example.electronics.security.jwt;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.example.electronics.security.auth.admin.StaffDetails;
import org.example.electronics.security.auth.user.CustomerDetails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.Objects;
import java.util.UUID;

@Component
public class JwtUtils {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);
    public static final String ACCOUNT_TYPE_CUSTOMER = "CUSTOMER";
    public static final String ACCOUNT_TYPE_STAFF = "STAFF";
    private static final String ACCOUNT_TYPE_CLAIM = "accountType";

    @Value("${electronics.app.jwtSecret}")
    private String jwtSecret;

    @Value("${electronics.app.jwtExpirationMs}")
    private int jwtExpirationMs;

    private SecretKey key() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    @PostConstruct
    void validateJwtSettings() {
        if (jwtSecret == null || jwtSecret.getBytes(StandardCharsets.UTF_8).length < 32) {
            throw new IllegalStateException("JWT secret must be configured and at least 32 bytes long");
        }

        if (jwtExpirationMs <= 0) {
            throw new IllegalStateException("JWT expiration must be a positive value");
        }
    }

    public String generateJwtToken(Authentication authentication) {
        Objects.requireNonNull(authentication, "Authentication không được null");
        Objects.requireNonNull(authentication.getPrincipal(), "Principal không được null");

        Object principal = authentication.getPrincipal();

        if (principal instanceof UserDetails userPrincipal) {
            return Jwts.builder()
                    .subject(userPrincipal.getUsername())
                    .id(UUID.randomUUID().toString())
                    .claim(ACCOUNT_TYPE_CLAIM, resolveAccountType(principal))
                    .issuedAt(new Date())
                    .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                    .signWith(key())
                    .compact();
        }
        else {
            logger.error("Principal không phải là UserDetails. Kiểu hiện tại: {}", principal.getClass().getName());
            throw new IllegalArgumentException("Chỉ hỗ trợ tạo Token cho kiểu UserDetails");
        }
    }

    public String getEmailFromJwtToken(String token) {
        return Jwts.parser()
                .verifyWith(key())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public String getAccountTypeFromJwtToken(String token) {
        String accountType = Jwts.parser()
                .verifyWith(key())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get(ACCOUNT_TYPE_CLAIM, String.class);

        return accountType == null || accountType.isBlank() ? ACCOUNT_TYPE_STAFF : accountType;
    }

    public boolean validateJwtToken(String token) {
        try {
            Jwts.parser().verifyWith(key()).build().parseSignedClaims(token);
            return true;
        }
        catch (JwtException e) {
            logger.warn("JWT validation failed: {}", e.getClass().getSimpleName());
        }
        catch (IllegalArgumentException e) {
            logger.warn("JWT validation failed: empty token");
        }

        return false;
    }

    public String extractTokenId(String token) {
        return Jwts.parser()
                .verifyWith(key())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getId();
    }

    public LocalDateTime extractExpiration(String token) {
        Date expirationDate = Jwts.parser()
                .verifyWith(key())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getExpiration();

        return expirationDate.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();
    }

    private String resolveAccountType(Object principal) {
        if (principal instanceof CustomerDetails) {
            return ACCOUNT_TYPE_CUSTOMER;
        }

        if (principal instanceof StaffDetails) {
            return ACCOUNT_TYPE_STAFF;
        }

        return ACCOUNT_TYPE_STAFF;
    }
}
