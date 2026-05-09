package org.example.electronics.service.system;

import java.util.Map;

public interface SystemPaymentService {

    String processVNPayIPN(Map<String, String> fields);
    void processMomoIPN(Map<String, Object> requestBody);
}
