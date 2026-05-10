package org.example.electronics.security.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.electronics.monitoring.MonitoringLogger;
import org.example.electronics.repository.InvalidatedTokenRepository;
import org.example.electronics.security.auth.admin.StaffDetailsService;
import org.example.electronics.security.auth.user.CustomerDetailsService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Slf4j
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final StaffDetailsService staffDetailsService;
    private final CustomerDetailsService customerDetailsService;

    private final InvalidatedTokenRepository invalidatedTokenRepository;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest httpServletRequest,
                                    @NonNull HttpServletResponse httpServletResponse,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {
        try {
            String jwt = parseJwt(httpServletRequest);

            if (jwt != null && jwtUtils.validateJwtToken(jwt)) {

                String tokenId = jwtUtils.extractTokenId(jwt);

                if (tokenId != null && !invalidatedTokenRepository.existsById(tokenId)) {
                    String email = jwtUtils.getEmailFromJwtToken(jwt);
                    String accountType = jwtUtils.getAccountTypeFromJwtToken(jwt);

                    UserDetails userDetails = loadUserDetails(email, accountType);
                    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities()
                    );
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(httpServletRequest));

                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                }
                else {
                    MonitoringLogger.warn(log, "auth.invalidated_token_used", MonitoringLogger.fields(
                            "method", httpServletRequest.getMethod(),
                            "path", httpServletRequest.getRequestURI(),
                            "tokenId", tokenId
                    ));
                }
            }
        }
        catch (Exception e) {
            MonitoringLogger.warn(log, "auth.jwt_filter_failed", MonitoringLogger.fields(
                    "exception", e.getClass().getSimpleName(),
                    "message", e.getMessage(),
                    "method", httpServletRequest.getMethod(),
                    "path", httpServletRequest.getRequestURI()
            ));
        }

        filterChain.doFilter(httpServletRequest, httpServletResponse);
    }

    private String parseJwt(HttpServletRequest httpServletRequest) {
        String headerAuth = httpServletRequest.getHeader("Authorization");

        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }

        return null;
    }

    private UserDetails loadUserDetails(String email, String accountType) {
        if (JwtUtils.ACCOUNT_TYPE_CUSTOMER.equalsIgnoreCase(accountType)) {
            return customerDetailsService.loadUserByUsername(email);
        }

        return staffDetailsService.loadUserByUsername(email);
    }
}
