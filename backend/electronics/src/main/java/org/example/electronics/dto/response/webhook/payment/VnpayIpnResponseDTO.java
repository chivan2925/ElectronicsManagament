package org.example.electronics.dto.response.webhook.payment;

public record VnpayIpnResponseDTO(

        String RspCode,
        String Message
) {

    public static VnpayIpnResponseDTO success() {
        return new VnpayIpnResponseDTO("00", "Confirm Success");
    }

    public static VnpayIpnResponseDTO orderNotFound() {
        return new VnpayIpnResponseDTO("01", "Order not found");
    }

    public static VnpayIpnResponseDTO invalidSignature() {
        return new VnpayIpnResponseDTO("97", "Invalid signature");
    }
}
