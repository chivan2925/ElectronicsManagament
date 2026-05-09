import ClientPlaceholderPage from "../../components/common/ClientPlaceholderPage";

function Register() {
  return (
    <ClientPlaceholderPage
      badge="ĐĂNG KÝ"
      features={["Thông tin cá nhân", "Email / số điện thoại", "Mật khẩu an toàn", "Xác nhận tài khoản"]}
      primaryLabel="Khám phá sản phẩm"
      subtitle="Trang đăng ký khách hàng sẽ chuẩn bị cho luồng tài khoản, đặt hàng và theo dõi đơn."
      title="Tạo tài khoản ElectroStore"
    />
  );
}

export default Register;
