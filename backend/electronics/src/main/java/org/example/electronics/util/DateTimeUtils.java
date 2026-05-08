package org.example.electronics.util;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class DateTimeUtils {

    private DateTimeUtils() {
        throw new IllegalStateException("Utility Class");
    }

    public static LocalDateTime getStartOfDay(LocalDate date) {
        return (date != null) ? date.atStartOfDay() : null;
    }

    public static LocalDateTime getEndOfDay(LocalDate date) {
        return (date != null) ? date.atTime(LocalTime.MAX) : null;
    }
}
