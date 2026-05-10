package org.example.electronics.controller.system;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.electronics.monitoring.MonitoringLogger;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.OffsetDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "System - Health", description = "Minimal health and readiness probes for deployment checks")
public class SystemHealthController {

    private final JdbcTemplate jdbcTemplate;

    @GetMapping
    @Operation(summary = "Liveness probe", description = "Returns basic API process health without exposing sensitive configuration.")
    public ResponseEntity<Map<String, Object>> liveness() {
        return buildHealthResponse("UP", Map.of(), HttpStatus.OK);
    }

    @GetMapping("/readiness")
    @Operation(summary = "Readiness probe", description = "Checks whether the API can reach required runtime dependencies.")
    public ResponseEntity<Map<String, Object>> readiness() {
        HealthCheck databaseCheck = checkDatabase();
        Map<String, Object> checks = new LinkedHashMap<>();

        checks.put("database", Map.of(
                "latencyMs", databaseCheck.latencyMs(),
                "status", databaseCheck.up() ? "UP" : "DOWN"
        ));

        return buildHealthResponse(
                databaseCheck.up() ? "UP" : "DOWN",
                checks,
                databaseCheck.up() ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE
        );
    }

    private ResponseEntity<Map<String, Object>> buildHealthResponse(
            String status,
            Map<String, Object> checks,
            HttpStatus httpStatus
    ) {
        Map<String, Object> body = new LinkedHashMap<>();

        body.put("status", status);
        body.put("service", "electronics-api");
        body.put("timestamp", OffsetDateTime.now().toString());
        body.put("requestId", MonitoringLogger.currentRequestId());

        if (!checks.isEmpty()) {
            body.put("checks", checks);
        }

        return ResponseEntity.status(httpStatus)
                .cacheControl(CacheControl.noStore())
                .body(body);
    }

    private HealthCheck checkDatabase() {
        long startedAtNanos = System.nanoTime();

        try {
            Integer result = jdbcTemplate.queryForObject("select 1", Integer.class);

            return new HealthCheck(Integer.valueOf(1).equals(result), elapsedMillis(startedAtNanos));
        } catch (Exception exception) {
            MonitoringLogger.warn(log, "health.database.unavailable", MonitoringLogger.fields(
                    "exception", exception.getClass().getSimpleName()
            ));

            return new HealthCheck(false, elapsedMillis(startedAtNanos));
        }
    }

    private long elapsedMillis(long startedAtNanos) {
        return TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startedAtNanos);
    }

    private record HealthCheck(boolean up, long latencyMs) {
    }
}
