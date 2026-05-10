package org.example.electronics.service.system;

import org.example.electronics.entity.enums.PaymentStatus;

public interface SystemOrderService {

    void confirmSuccessfulPayment(Integer orderId);
    void closeUnpaidOrder(Integer orderId, PaymentStatus paymentStatus, String note);
}
