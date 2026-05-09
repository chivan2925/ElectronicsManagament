import AuthLayout from "../../components/auth/AuthLayout";
import LoginForm from "../../components/auth/LoginForm";

function Login() {
  return (
    <AuthLayout
      badge="Customer login"
      subtitle="Đăng nhập vào tài khoản khách hàng để chuẩn bị lưu giỏ hàng, theo dõi đơn và nhận ưu đãi cho gear yêu thích."
      switchLabel="Tạo tài khoản"
      switchText="Chưa có tài khoản?"
      switchTo="/register"
      title="Chào mừng trở lại ElectroStore"
    >
      <LoginForm />
    </AuthLayout>
  );
}

export default Login;
