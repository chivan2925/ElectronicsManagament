import ClientPlaceholderPage from "../../components/common/ClientPlaceholderPage";

function Cart() {
  return (
    <ClientPlaceholderPage
      badge="GIỎ HÀNG"
      features={["Cập nhật số lượng", "Tính tạm tính", "Áp mã giảm giá", "Chuẩn bị thanh toán"]}
      primaryLabel="Tiếp tục mua sắm"
      subtitle="Giỏ hàng sẽ quản lý sản phẩm khách chọn, số lượng, giá tạm tính và bước chuyển sang checkout."
      title="Giỏ hàng của bạn"
    />
  );
}

export default Cart;
