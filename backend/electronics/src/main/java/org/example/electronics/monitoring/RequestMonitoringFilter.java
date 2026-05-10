package org.example.electronics.monitoring;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
@Slf4j
public class RequestMonitoringFilter extends OncePerRequestFilter {

    private static final String METHOD_KEY = "method";
    private static final String PATH_KEY = "path";

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        long startedAtNanos = System.nanoTime();
        String requestId = resolveRequestId(request);

        MDC.put(MonitoringLogger.REQUEST_ID_KEY, requestId);
        MDC.put(METHOD_KEY, request.getMethod());
        MDC.put(PATH_KEY, request.getRequestURI());
        response.setHeader(MonitoringLogger.REQUEST_ID_HEADER, requestId);

        try {
            filterChain.doFilter(request, response);
        } finally {
            MonitoringLogger.info(log, "http.request.completed", MonitoringLogger.fields(
                    "durationMs", (System.nanoTime() - startedAtNanos) / 1_000_000,
                    "method", request.getMethod(),
                    "path", request.getRequestURI(),
                    "query", request.getQueryString(),
                    "status", response.getStatus()
            ));
            MDC.remove(MonitoringLogger.REQUEST_ID_KEY);
            MDC.remove(METHOD_KEY);
            MDC.remove(PATH_KEY);
        }
    }

    private String resolveRequestId(HttpServletRequest request) {
        String requestId = request.getHeader(MonitoringLogger.REQUEST_ID_HEADER);

        if (StringUtils.hasText(requestId)) {
            return requestId.trim();
        }

        return UUID.randomUUID().toString();
    }
}
