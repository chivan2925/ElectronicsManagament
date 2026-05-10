package org.example.electronics.security.jwt;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.electronics.monitoring.MonitoringLogger;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtAuthEntryPoint implements AuthenticationEntryPoint {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthEntryPoint.class);

    @Override
    public void commence(
            HttpServletRequest httpServletRequest,
            HttpServletResponse httpServletResponse,
            AuthenticationException authenticationException
    ) throws IOException {
        MonitoringLogger.warn(logger, "auth.unauthorized_request", MonitoringLogger.fields(
                "exception", authenticationException.getClass().getSimpleName(),
                "message", authenticationException.getMessage(),
                "method", httpServletRequest.getMethod(),
                "path", httpServletRequest.getServletPath(),
                "status", HttpServletResponse.SC_UNAUTHORIZED
        ));

        httpServletResponse.setContentType(MediaType.APPLICATION_JSON_VALUE);
        httpServletResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        httpServletResponse.setHeader(MonitoringLogger.REQUEST_ID_HEADER, MonitoringLogger.currentRequestId());

        final Map<String, Object> body = new HashMap<>();
        body.put("status", HttpServletResponse.SC_UNAUTHORIZED);
        body.put("error", "Unauthorized");
        body.put("message", "Bạn chưa đăng nhập hoặc Token đã hết hạn. Vui lòng đăng nhập lại");
        body.put("path", httpServletRequest.getServletPath());
        body.put("requestId", MonitoringLogger.currentRequestId());

        final ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.writeValue(httpServletResponse.getOutputStream(), body);
    }
}
