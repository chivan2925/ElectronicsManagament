package org.example.electronics.config;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DatabaseMigrationConfig {

    private final JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void migrate() {
        try {
            log.info("Executing database migration: ALTER TABLE warehouse_transactions ALTER COLUMN staff_id DROP NOT NULL;");
            jdbcTemplate.execute("ALTER TABLE warehouse_transactions ALTER COLUMN staff_id DROP NOT NULL;");
            log.info("Database migration successful.");
        } catch (Exception e) {
            log.error("Failed to execute database migration: ", e);
        }
    }
}
