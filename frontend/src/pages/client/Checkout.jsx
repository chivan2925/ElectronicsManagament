import ClientPlaceholderPage from "../../components/common/ClientPlaceholderPage";

function Checkout() {
  return (
    <ClientPlaceholderPage
      badge="THANH TOÁN"
      features={["Thông tin giao hàng", "Phương thức thanh toán", "Tóm tắt đơn hàng", "Xác nhận đặt hàng"]}
      primaryLabel="Xem giỏ hàng"
      subtitle="Checkout sẽ gom thông tin khách hàng, địa chỉ giao hàng, phương thức thanh toán và xác nhận đơn hàng."
      title="Hoàn tất đơn hàng"
    />
  );
}

export default Checkout;
