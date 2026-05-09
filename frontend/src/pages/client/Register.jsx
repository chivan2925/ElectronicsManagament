import AuthLayout from "../../components/auth/AuthLayout";
import RegisterForm from "../../components/auth/RegisterForm";

function Register() {
  return (
    <AuthLayout
      badge="Customer signup"
      subtitle="Tạo tài khoản cho trải nghiệm mua sắm điện tử và gaming, lưu ưu đãi, theo dõi đơn hàng và rút ngắn bước checkout."
      switchLabel="Đăng nhập"
      switchText="Đã có tài khoản?"
      switchTo="/login"
      title="Tạo tài khoản ElectroStore"
    >
      <RegisterForm />
    </AuthLayout>
  );
}

export default Register;
