package org.example.electronics.service.admin.impl.payment;

import lombok.RequiredArgsConstructor;
import org.example.electronics.entity.PaymentTransactionEntity;
import org.example.electronics.entity.ReturnRequestEntity;
import org.example.electronics.entity.enums.PaymentTransactionStatus;
import org.example.electronics.entity.enums.PaymentTransactionType;
import org.example.electronics.repository.PaymentTransactionRepository;
import org.example.electronics.service.admin.payment.RefundStrategy;

import java.time.LocalDateTime;

@RequiredArgsConstructor
public abstract class AbstractRefundStrategy implements RefundStrategy {

    protected final PaymentTransactionRepository paymentTransactionRepository;

    protected void saveRefundTransaction(PaymentTransactionEntity originalPaymentTransaction, ReturnRequestEntity returnRequest, String note) {
        PaymentTransactionEntity refundTx = PaymentTransactionEntity.builder()
                .order(originalPaymentTransaction.getOrder())
                .returnRequest(returnRequest)
                .type(PaymentTransactionType.REFUND)
                .provider(originalPaymentTransaction.getProvider())
                .providerPaymentId(originalPaymentTransaction.getProviderPaymentId())
                .amount(originalPaymentTransaction.getAmount())
                .status(PaymentTransactionStatus.SUCCESS)
                .paymentTime(LocalDateTime.now())
                .note("Hoàn tiền cho yêu cầu trả hàng #" + returnRequest.getId() + ". " + note)
                .build();

        paymentTransactionRepository.save(refundTx);
    }
}
