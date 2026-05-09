import ClientPlaceholderPage from "../../components/common/ClientPlaceholderPage";

function Login() {
  return (
    <ClientPlaceholderPage
      badge="ĐĂNG NHẬP"
      features={["Email / số điện thoại", "Mật khẩu", "Ghi nhớ đăng nhập", "Quên mật khẩu"]}
      primaryLabel="Tiếp tục mua sắm"
      subtitle="Trang đăng nhập khách hàng sẽ kết nối API auth khi backend public/customer auth sẵn sàng."
      title="Đăng nhập tài khoản khách hàng"
    />
  );
}

export default Login;
