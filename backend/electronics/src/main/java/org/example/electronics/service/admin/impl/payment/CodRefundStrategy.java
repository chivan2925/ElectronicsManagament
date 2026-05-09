package org.example.electronics.service.admin.impl.payment;

import org.example.electronics.entity.PaymentTransactionEntity;
import org.example.electronics.entity.ReturnRequestEntity;
import org.example.electronics.entity.enums.PaymentProvider;
import org.example.electronics.repository.PaymentTransactionRepository;
import org.springframework.stereotype.Component;

@Component
public class CodRefundStrategy extends AbstractRefundStrategy{

    public CodRefundStrategy(PaymentTransactionRepository paymentTransactionRepository) {
        super(paymentTransactionRepository);
    }

    @Override
    public PaymentProvider getSupportedProvider() {
        return PaymentProvider.COD;
    }

    @Override
    public void process(PaymentTransactionEntity originalTx, ReturnRequestEntity returnRequest, Integer staffId) {
        saveRefundTransaction(originalTx, returnRequest, "Hoàn tiền mặt trực tiếp");
    }
}
