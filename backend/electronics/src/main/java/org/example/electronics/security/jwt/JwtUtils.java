package org.example.electronics.security.jwt;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    @Value("${electronics.app.jwtSecret}")
    private String jwtSecret;

    @Value("${electronics.app.jwtExpirationMs}")
    private int jwtExpirationMs;

    private SecretKey key() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateJwtToken(Authentication authentication) {
        Objects.requireNonNull(authentication, "Authentication không được null");
        Objects.requireNonNull(authentication.getPrincipal(), "Principal không được null");

        Object principal = authentication.getPrincipal();

        if (principal instanceof UserDetails userPrincipal) {
            return Jwts.builder()
                    .subject(userPrincipal.getUsername())
                    .id(UUID.randomUUID().toString())
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

    public boolean validateJwtToken(String token) {
        try {
            Jwts.parser().verifyWith(key()).build().parseSignedClaims(token);
            return true;
        }
        catch (MalformedJwtException e) {
            logger.error("Token không đúng định dạng {}", e.getMessage());
        }
        catch (ExpiredJwtException e) {
            logger.error("Token đã hết hạn: {}", e.getMessage());
        }
        catch (UnsupportedJwtException e) {
            logger.error("Token không được hỗ trợ: {}", e.getMessage());
        }
        catch (IllegalArgumentException e) {
            logger.error("Chuỗi JWT bị trống: {}", e.getMessage());
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
}
