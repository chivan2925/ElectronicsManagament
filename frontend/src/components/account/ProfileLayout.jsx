import { Link, Outlet } from "react-router-dom";
import { ChevronRight, PackageCheck, ShieldCheck, UserRound, WalletCards } from "lucide-react";
import useAccountProfile from "../../hooks/useAccountProfile";
import TrustSignalBar from "../common/TrustSignalBar";
import Badge from "../ui/Badge";
import Container from "../ui/Container";
import AccountSidebar from "./AccountSidebar";

function ProfileLayout() {
  const account = useAccountProfile();
  const { isLoadingProfile, profile } = account;

  return (
    <>
      <Container as="main" className="pb-16 pt-6 sm:pt-8" id="main-content" tabIndex={-1}>
        <nav aria-label="Breadcrumb" className="mb-4 flex min-w-0 flex-wrap items-center gap-2 text-sm font-bold text-slate-400">
          <Link className="premium-transition hover:text-white" to="/">
            Trang chủ
          </Link>
          <ChevronRight className="text-slate-600" size={15} />
          <span className="text-blue-200">Tài khoản</span>
        </nav>

        <section className="store-hero-panel p-5 sm:p-7 lg:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_32%,rgba(0,91,255,0.12))]" />
          <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_380px] lg:items-center">
            <div>
              <Badge className="mb-4 gap-2" variant="primary">
                <UserRound size={13} />
                Account center
              </Badge>
              <h1 className="text-heading max-w-3xl">Khu vực tài khoản</h1>
              <p className="text-muted mt-3 max-w-2xl text-base md:text-lg">
                Quản lý hồ sơ mua hàng, kiểm tra lịch sử đơn và cập nhật thông tin liên hệ trong một trải nghiệm ecommerce dark theme nhất quán.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[
                { icon: ShieldCheck, label: profile?.status || "ACTIVE", value: "Trạng thái tài khoản" },
                { icon: PackageCheck, label: "Order API", value: "Lịch sử đơn hàng thật" },
                { icon: WalletCards, label: "Profile API", value: isLoadingProfile ? "Đang đồng bộ" : "Sẵn sàng cập nhật" },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div className="store-stat-card rounded-2xl p-3" key={item.value}>
                    <Icon className="mb-3 text-blue-200 drop-shadow-[0_0_14px_rgba(0,91,255,0.55)]" size={20} />
                    <p className="text-sm font-black text-white">{item.label}</p>
                    <p className="text-caption mt-1 text-slate-400">{item.value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <TrustSignalBar
          className="mt-5"
          compact
          signals={[
            { icon: "ShieldCheck", label: "Tài khoản an toàn", value: profile?.status || "ACTIVE" },
            { icon: "PackageCheck", label: "Đơn hàng", value: "Theo dõi lịch sử mua" },
            { icon: "WalletCards", label: "Ưu đãi thành viên", value: "Coupon và điểm thưởng" },
            { icon: "Headphones", label: "Hỗ trợ", value: "Thông tin dùng cho checkout" },
          ]}
        />

        <div className="mt-7 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start xl:grid-cols-[300px_minmax(0,1fr)]">
          <AccountSidebar isLoading={isLoadingProfile} profile={profile} />
          <Outlet context={account} />
        </div>
      </Container>
    </>
  );
}

export default ProfileLayout;
