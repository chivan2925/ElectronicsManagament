package org.example.electronics.monitoring;

import org.slf4j.Logger;
import org.slf4j.MDC;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;
import java.util.StringJoiner;

public final class MonitoringLogger {

    public static final String REQUEST_ID_KEY = "requestId";
    public static final String REQUEST_ID_HEADER = "X-Request-Id";

    private static final int MAX_VALUE_LENGTH = 500;
    private static final Set<String> SENSITIVE_KEYS = Set.of(
            "authorization",
            "cookie",
            "jwt",
            "password",
            "secret",
            "token"
    );

    private MonitoringLogger() {
    }

    public static Map<String, Object> fields(Object... keyValues) {
        Map<String, Object> fields = new LinkedHashMap<>();

        for (int index = 0; index + 1 < keyValues.length; index += 2) {
            fields.put(String.valueOf(keyValues[index]), keyValues[index + 1]);
        }

        return fields;
    }

    public static void info(Logger logger, String event, Map<String, ?> fields) {
        logger.info(format(event, fields));
    }

    public static void warn(Logger logger, String event, Map<String, ?> fields) {
        logger.warn(format(event, fields));
    }

    public static void warn(Logger logger, String event, Map<String, ?> fields, Throwable throwable) {
        logger.warn(format(event, fields), throwable);
    }

    public static void error(Logger logger, String event, Map<String, ?> fields) {
        logger.error(format(event, fields));
    }

    public static void error(Logger logger, String event, Map<String, ?> fields, Throwable throwable) {
        logger.error(format(event, fields), throwable);
    }

    public static String currentRequestId() {
        return MDC.get(REQUEST_ID_KEY);
    }

    public static String maskEmail(String email) {
        if (email == null || email.isBlank()) {
            return "";
        }

        String trimmedEmail = email.trim();
        int atIndex = trimmedEmail.indexOf('@');

        if (atIndex <= 1) {
            return "***" + (atIndex >= 0 ? trimmedEmail.substring(atIndex) : "");
        }

        return trimmedEmail.substring(0, Math.min(2, atIndex)) + "***" + trimmedEmail.substring(atIndex);
    }

    private static String format(String event, Map<String, ?> fields) {
        Map<String, Object> mergedFields = new LinkedHashMap<>();

        mergedFields.put("event", event);
        mergedFields.put("requestId", currentRequestId());

        if (fields != null) {
            mergedFields.putAll(fields);
        }

        StringJoiner joiner = new StringJoiner(" ");
        mergedFields.forEach((key, value) -> joiner.add(key + "=" + formatValue(key, value)));

        return joiner.toString();
    }

    private static String formatValue(String key, Object value) {
        if (value == null) {
            return "null";
        }

        if (isSensitiveKey(key)) {
            return "\"[redacted]\"";
        }

        if (value instanceof Number || value instanceof Boolean) {
            return String.valueOf(value);
        }

        String text = String.valueOf(value)
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r");

        if (text.length() > MAX_VALUE_LENGTH) {
            text = text.substring(0, MAX_VALUE_LENGTH) + "...";
        }

        return "\"" + text + "\"";
    }

    private static boolean isSensitiveKey(String key) {
        String normalizedKey = key == null ? "" : key.toLowerCase();

        return SENSITIVE_KEYS.stream().anyMatch(normalizedKey::contains);
    }
}
