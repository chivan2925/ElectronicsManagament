package org.example.electronics.security.jwt;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.electronics.monitoring.MonitoringLogger;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtAccessDeniedHandler implements AccessDeniedHandler {

    private static final Logger logger = LoggerFactory.getLogger(JwtAccessDeniedHandler.class);

    @Override
    public void handle(
            HttpServletRequest request,
            HttpServletResponse response,
            AccessDeniedException accessDeniedException
    ) throws IOException {
        MonitoringLogger.warn(logger, "auth.forbidden_request", MonitoringLogger.fields(
                "exception", accessDeniedException.getClass().getSimpleName(),
                "method", request.getMethod(),
                "path", request.getServletPath(),
                "status", HttpServletResponse.SC_FORBIDDEN
        ));

        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setHeader("Cache-Control", "no-store");
        response.setHeader("Pragma", "no-cache");
        response.setHeader(MonitoringLogger.REQUEST_ID_HEADER, MonitoringLogger.currentRequestId());

        Map<String, Object> body = new HashMap<>();
        body.put("status", HttpServletResponse.SC_FORBIDDEN);
        body.put("error", "Forbidden");
        body.put("message", "Tài khoản hiện tại không có quyền thực hiện thao tác này");
        body.put("path", request.getServletPath());
        body.put("requestId", MonitoringLogger.currentRequestId());

        new ObjectMapper().writeValue(response.getOutputStream(), body);
    }
}
