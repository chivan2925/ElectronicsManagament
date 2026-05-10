package org.example.electronics.config;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Component
@Profile("prod")
public class ProductionConfigurationValidator implements ApplicationRunner {

    private static final List<String> REQUIRED_SECRET_PROPERTIES = List.of(
            "spring.datasource.password",
            "electronics.app.jwtSecret",
            "payment.vnpay.tmn-code",
            "payment.vnpay.secret-key",
            "payment.momo.partner-code",
            "payment.momo.access-key",
            "payment.momo.secret-key",
            "cloudinary.cloud-name",
            "cloudinary.api-key",
            "cloudinary.api-secret"
    );

    private static final List<String> REQUIRED_HTTPS_PROPERTIES = List.of(
            "payment.frontend.success-url",
            "payment.frontend.failed-url",
            "payment.vnpay.pay-url",
            "payment.vnpay.refund-url",
            "payment.vnpay.return-url",
            "payment.momo.endpoint",
            "payment.momo.refund-url",
            "payment.momo.return-url",
            "payment.momo.notify-url"
    );

    private final Environment environment;

    public ProductionConfigurationValidator(Environment environment) {
        this.environment = environment;
    }

    @Override
    public void run(ApplicationArguments args) {
        List<String> errors = new ArrayList<>();

        requireExactValue("spring.jpa.hibernate.ddl-auto", "validate", errors);
        requireExactValue("spring.jpa.show-sql", "false", errors);
        requireExactValue("springdoc.api-docs.enabled", "false", errors);
        requireExactValue("springdoc.swagger-ui.enabled", "false", errors);

        REQUIRED_SECRET_PROPERTIES.forEach((propertyName) -> requireSecret(propertyName, errors));
        REQUIRED_HTTPS_PROPERTIES.forEach((propertyName) -> requireHttpsUrl(propertyName, errors));

        requireJwtSecretStrength(errors);
        rejectSandboxEndpoint("payment.vnpay.pay-url", "sandbox", errors);
        rejectSandboxEndpoint("payment.vnpay.refund-url", "sandbox", errors);
        rejectSandboxEndpoint("payment.momo.endpoint", "test-payment", errors);
        rejectSandboxEndpoint("payment.momo.refund-url", "test-payment", errors);
        validateCors(errors);

        if (!errors.isEmpty()) {
            throw new IllegalStateException(
                    "Invalid production configuration:\n- " + String.join("\n- ", errors)
            );
        }
    }

    private void requireExactValue(String propertyName, String expectedValue, List<String> errors) {
        String value = normalizedValue(propertyName);

        if (!expectedValue.equalsIgnoreCase(value)) {
            errors.add(propertyName + " must be " + expectedValue + " in the prod profile.");
        }
    }

    private void requireSecret(String propertyName, List<String> errors) {
        String value = normalizedValue(propertyName);

        if (value.isBlank()) {
            errors.add(propertyName + " must be provided through environment-specific secrets.");
            return;
        }

        if (looksLikePlaceholder(value)) {
            errors.add(propertyName + " must not use a development, CI, or placeholder value.");
        }
    }

    private void requireHttpsUrl(String propertyName, List<String> errors) {
        String value = normalizedValue(propertyName);
        String lowerValue = value.toLowerCase(Locale.ROOT);

        if (value.isBlank()) {
            errors.add(propertyName + " must be configured.");
            return;
        }

        if (!lowerValue.startsWith("https://")) {
            errors.add(propertyName + " must use HTTPS in the prod profile.");
        }

        if (lowerValue.contains("localhost")
                || lowerValue.contains("127.0.0.1")
                || lowerValue.contains(".local")
                || lowerValue.contains("example")) {
            errors.add(propertyName + " must point to a real production host.");
        }
    }

    private void requireJwtSecretStrength(List<String> errors) {
        String jwtSecret = normalizedValue("electronics.app.jwtSecret");

        if (!jwtSecret.isBlank() && jwtSecret.getBytes(StandardCharsets.UTF_8).length < 32) {
            errors.add("electronics.app.jwtSecret must be at least 32 bytes.");
        }
    }

    private void rejectSandboxEndpoint(String propertyName, String disallowedToken, List<String> errors) {
        String value = normalizedValue(propertyName).toLowerCase(Locale.ROOT);

        if (value.contains(disallowedToken)) {
            errors.add(propertyName + " must not use sandbox/test payment endpoints in the prod profile.");
        }
    }

    private void validateCors(List<String> errors) {
        String value = normalizedValue("app.cors.allowed-origin-patterns");
        String lowerValue = value.toLowerCase(Locale.ROOT);

        if (value.isBlank()) {
            errors.add("app.cors.allowed-origin-patterns must be configured for production.");
            return;
        }

        if (value.contains("*")
                || lowerValue.contains("localhost")
                || lowerValue.contains("127.0.0.1")
                || lowerValue.contains(".local")
                || lowerValue.contains("example")) {
            errors.add("app.cors.allowed-origin-patterns must contain explicit production origins only.");
        }
    }

    private String normalizedValue(String propertyName) {
        return environment.getProperty(propertyName, "").trim();
    }

    private boolean looksLikePlaceholder(String value) {
        String normalized = value.toLowerCase(Locale.ROOT);

        return normalized.contains("change-me")
                || normalized.contains("replace-with")
                || normalized.contains("dev-only")
                || normalized.contains("your_")
                || normalized.contains("your-")
                || normalized.contains("placeholder")
                || normalized.contains("ci_")
                || normalized.equals("your_secret_key")
                || normalized.equals("your_tmn_code")
                || normalized.equals("momo_partner_code")
                || normalized.equals("momo_access_key")
                || normalized.equals("momo_secret_key");
    }
}
