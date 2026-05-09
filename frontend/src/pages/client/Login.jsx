import AuthLayout from "../../components/auth/AuthLayout";
import LoginForm from "../../components/auth/LoginForm";

function Login() {
  return (
    <AuthLayout
      badge="Customer login"
      subtitle="Đăng nhập bằng email để hệ thống điều hướng đúng theo vai trò tài khoản của bạn."
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
