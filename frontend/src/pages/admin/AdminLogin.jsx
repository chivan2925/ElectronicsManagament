import { Database, ShieldCheck, UserCog } from "lucide-react";
import AuthLayout from "../../components/auth/AuthLayout";
import LoginForm from "../../components/auth/LoginForm";

const adminHighlights = [
  {
    icon: ShieldCheck,
    label: "JWT bảo mật",
    value: "Phiên đăng nhập dùng access token từ backend Spring Boot.",
  },
  {
    icon: UserCog,
    label: "Vai trò nhân sự",
    value: "Điều hướng theo role admin hoặc staff sau khi đăng nhập.",
  },
  {
    icon: Database,
    label: "Sẵn sàng API",
    value: "Chuẩn bị cho các màn CRUD kết nối dữ liệu thật.",
  },
];

function AdminLogin() {
  return (
    <AuthLayout
      backLabel="Về cửa hàng"
      badge="Admin login"
      highlights={adminHighlights}
      showStoreHeader={false}
      subtitle="Đăng nhập bằng tài khoản nhân sự để truy cập dashboard, quản lý danh mục, sản phẩm, đơn hàng và báo cáo."
      switchLabel="Đăng nhập khách hàng"
      switchText="Không phải nhân sự?"
      switchTo="/login"
      title="Admin Console ElectronicsManagement"
    >
      <LoginForm
        showSocialAuth={false}
        submitLabel="Vào dashboard"
        subtitle="Sử dụng email và mật khẩu nhân sự đã được cấp trong hệ thống."
        title="Đăng nhập quản trị"
      />
    </AuthLayout>
  );
}

export default AdminLogin;
