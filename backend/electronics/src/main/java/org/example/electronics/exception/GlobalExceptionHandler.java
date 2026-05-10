package org.example.electronics.exception;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.example.electronics.dto.response.system.ErrorResponseDTO;
import org.example.electronics.monitoring.MonitoringLogger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponseDTO> handleBadCredentialsException(
            BadCredentialsException exception,
            HttpServletRequest request
    ) {
        HttpStatus status = HttpStatus.UNAUTHORIZED;
        logHandledClientException("auth.login.bad_credentials", status, exception, request);

        return buildResponse(status, "Email hoặc mật khẩu không đúng", null, request);
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<ErrorResponseDTO> handleDisabledException(
            DisabledException exception,
            HttpServletRequest request
    ) {
        HttpStatus status = HttpStatus.FORBIDDEN;
        logHandledClientException("auth.login.disabled", status, exception, request);

        return buildResponse(status, "Tài khoản đang bị khóa hoặc chưa được kích hoạt", null, request);
    }

    @ExceptionHandler(LockedException.class)
    public ResponseEntity<ErrorResponseDTO> handleLockedException(
            LockedException exception,
            HttpServletRequest request
    ) {
        HttpStatus status = HttpStatus.LOCKED;
        logHandledClientException("auth.login.locked", status, exception, request);

        return buildResponse(status, "Tài khoản đã bị khóa", null, request);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponseDTO> handleIllegalArgumentException(
            IllegalArgumentException exception,
            HttpServletRequest request
    ) {
        HttpStatus status = HttpStatus.BAD_REQUEST;
        logHandledClientException("api.client_error", status, exception, request);

        return buildResponse(status, exception.getMessage(), null, request);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ErrorResponseDTO> handleIllegalStateException(
            IllegalStateException exception,
            HttpServletRequest request
    ) {
        HttpStatus status = HttpStatus.CONFLICT;
        logHandledClientException("api.state_conflict", status, exception, request);

        return buildResponse(status, exception.getMessage(), null, request);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleEntityNotFoundException(
            EntityNotFoundException exception,
            HttpServletRequest request
    ) {
        HttpStatus status = HttpStatus.NOT_FOUND;
        logHandledClientException("api.entity_not_found", status, exception, request);

        return buildResponse(status, exception.getMessage(), null, request);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDTO> handleValidationExceptions(
            MethodArgumentNotValidException exception,
            HttpServletRequest request
    ) {
        HttpStatus status = HttpStatus.BAD_REQUEST;
        Map<String, String> errors = new HashMap<>();

        exception.getBindingResult().getAllErrors().forEach((error) -> addValidationError(errors, error));
        MonitoringLogger.warn(log, "api.validation_failed", buildExceptionFields(status, exception, request, errors.size()));

        return buildResponse(status, "Dữ liệu đầu vào không hợp lệ", errors, request);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDTO> handleGlobalException(Exception exception, HttpServletRequest request) {
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        MonitoringLogger.error(log, "api.unhandled_exception", buildExceptionFields(status, exception, request, null), exception);

        return buildResponse(status, "Đã xảy ra lỗi hệ thống nội bộ. Vui lòng thử lại sau!", null, request);
    }

    private void addValidationError(Map<String, String> errors, ObjectError error) {
        String fieldName = error instanceof FieldError fieldError ? fieldError.getField() : error.getObjectName();
        String errorMessage = error.getDefaultMessage();

        errors.put(fieldName, errorMessage);
    }

    private ResponseEntity<ErrorResponseDTO> buildResponse(
            HttpStatus status,
            String message,
            Object details,
            HttpServletRequest request
    ) {
        ErrorResponseDTO response = ErrorResponseDTO.builder()
                .timestamp(LocalDateTime.now())
                .statusCode(status.value())
                .error(status.getReasonPhrase())
                .message(message)
                .details(details)
                .path(request == null ? null : request.getRequestURI())
                .requestId(MonitoringLogger.currentRequestId())
                .build();

        return ResponseEntity.status(status).body(response);
    }

    private void logHandledClientException(
            String event,
            HttpStatus status,
            Exception exception,
            HttpServletRequest request
    ) {
        MonitoringLogger.warn(log, event, buildExceptionFields(status, exception, request, null));
    }

    private Map<String, Object> buildExceptionFields(
            HttpStatus status,
            Exception exception,
            HttpServletRequest request,
            Integer detailCount
    ) {
        Map<String, Object> fields = MonitoringLogger.fields(
                "exception", exception.getClass().getSimpleName(),
                "message", exception.getMessage(),
                "method", request == null ? null : request.getMethod(),
                "path", request == null ? null : request.getRequestURI(),
                "status", status.value()
        );

        if (detailCount != null) {
            fields.put("detailCount", detailCount);
        }

        return fields;
    }
}
