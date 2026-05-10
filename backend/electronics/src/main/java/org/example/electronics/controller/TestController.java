package org.example.electronics.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class TestController {

    private final JdbcTemplate jdbcTemplate;

    @GetMapping("/api/test/migrate")
    public String migrate() {
        try {
            jdbcTemplate.execute("ALTER TABLE warehouse_transactions ALTER COLUMN staff_id DROP NOT NULL;");
            return "Success: staff_id is now nullable.";
        } catch (Exception e) {
            return "Failed: " + e.getMessage();
        }
    }
}
