package org.example.electronics.service.admin.payment;

import org.example.electronics.entity.PaymentTransactionEntity;
import org.example.electronics.entity.ReturnRequestEntity;
import org.example.electronics.entity.enums.PaymentProvider;

public interface RefundStrategy {

    PaymentProvider getSupportedProvider();

    void process(PaymentTransactionEntity originalTx, ReturnRequestEntity returnRequest, Integer staffId);
}
