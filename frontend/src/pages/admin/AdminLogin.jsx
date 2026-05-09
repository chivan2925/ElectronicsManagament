import { LockKeyhole, ShieldCheck } from "lucide-react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

function AdminLogin() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F6F8FB] px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
        <div className="mb-7 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-[0_0_28px_rgba(0,91,255,0.28)]">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-lg font-black text-ink">Admin Console</p>
            <p className="text-sm font-medium text-muted">ElectronicsManagement</p>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-black text-ink">Đăng nhập quản trị</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Placeholder cho luồng admin auth. API và protected routes sẽ được kết nối ở phase sau.
          </p>
        </div>

        <div className="space-y-4">
          <Input placeholder="admin@example.com" type="email" variant="light" />
          <Input placeholder="Mật khẩu" type="password" variant="light" />
          <Button className="h-11" fullWidth>
            <LockKeyhole size={18} />
            Đăng nhập
          </Button>
        </div>

        <p className="mt-5 rounded-xl bg-blue-50 p-3 text-sm font-medium text-primary">
          Route hiện tại: /admin/login
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
