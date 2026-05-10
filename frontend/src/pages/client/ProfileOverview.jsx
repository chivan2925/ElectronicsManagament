import { Link, useOutletContext } from "react-router-dom";
import { CalendarDays, ChevronRight, Mail, PackageSearch, Phone, Settings, UserRound } from "lucide-react";
import ApiErrorAlert from "../../components/ui/feedback/ApiErrorAlert";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import RecentlyViewedSection from "../../components/product/RecentlyViewedSection";
import RecommendationSection from "../../components/product/RecommendationSection";
import SkeletonBlock from "../../components/skeletons/SkeletonBlock";

function formatDate(value) {
  if (!value) {
    return "Chưa cập nhật";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function ProfileOverviewSkeleton() {
  return (
    <section className="rounded-3xl border border-white/10 bg-slate-950/36 p-5 shadow-inner shadow-white/[0.03] backdrop-blur-xl">
      <SkeletonBlock className="h-6 w-52" />
      <SkeletonBlock className="mt-5 h-20 w-full" />
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <SkeletonBlock className="h-24 w-full" />
        <SkeletonBlock className="h-24 w-full" />
      </div>
    </section>
  );
}

function InfoTile({ icon, label, value }) {
  const Icon = icon;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 shadow-inner shadow-white/[0.03]">
      <Icon className="text-blue-200 drop-shadow-[0_0_14px_rgba(0,91,255,0.46)]" size={20} />
      <p className="text-caption mt-3 text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-black text-white">{value || "Chưa cập nhật"}</p>
    </div>
  );
}

function ProfileOverview() {
  const { error, isLoadingProfile, profile, refreshProfile } = useOutletContext();

  if (isLoadingProfile && !profile?.id) {
    return <ProfileOverviewSkeleton />;
  }

  return (
    <div className="space-y-5">
      {error && (
        <ApiErrorAlert
          actionLabel="Thử lại"
          error={error}
          onAction={refreshProfile}
          surface="store"
          title="Chưa tải được hồ sơ"
        />
      )}

      <section className="rounded-3xl border border-white/10 bg-slate-950/36 p-5 shadow-inner shadow-white/[0.03] backdrop-blur-xl lg:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <Badge className="mb-4 gap-2" variant="primary">
              <UserRound size={13} />
              Profile
            </Badge>
            <h2 className="text-section">Thông tin tài khoản</h2>
            <p className="text-muted mt-2 text-sm">Dữ liệu hồ sơ được tải từ User API và dùng lại cho checkout khi có thể.</p>
          </div>

          <Button as={Link} className="rounded-2xl" to="/profile/settings" variant="outline">
            <Settings size={17} />
            Cập nhật hồ sơ
          </Button>
        </div>

        <div className="mt-5 rounded-3xl border border-blue-300/15 bg-blue-500/[0.055] p-4">
          <p className="text-caption text-blue-200">Xin chào</p>
          <h3 className="mt-1 text-2xl font-black text-white">{profile?.fullName || profile?.username || "Khách hàng"}</h3>
          <p className="text-muted mt-2 text-sm">
            Tài khoản đang ở trạng thái <span className="font-black text-emerald-200">{profile?.status || "ACTIVE"}</span>.
          </p>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <InfoTile icon={Mail} label="Email" value={profile?.email} />
          <InfoTile icon={Phone} label="Số điện thoại" value={profile?.phoneNumber} />
          <InfoTile icon={UserRound} label="Username" value={profile?.username} />
          <InfoTile icon={CalendarDays} label="Ngày sinh" value={formatDate(profile?.dateOfBirth)} />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Link
          className="premium-transition rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-inner shadow-white/[0.03] hover:-translate-y-0.5 hover:border-blue-300/40 hover:bg-blue-500/[0.065]"
          to="/profile/orders"
        >
          <PackageSearch className="text-blue-200" size={24} />
          <h3 className="mt-4 text-lg font-black text-white">Xem lịch sử đơn</h3>
          <p className="text-muted mt-2 text-sm">Kiểm tra đơn hàng, trạng thái thanh toán và chi tiết giao hàng.</p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-blue-200">
            Mở đơn hàng
            <ChevronRight size={16} />
          </span>
        </Link>

        <Link
          className="premium-transition rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-inner shadow-white/[0.03] hover:-translate-y-0.5 hover:border-blue-300/40 hover:bg-blue-500/[0.065]"
          to="/profile/settings"
        >
          <Settings className="text-blue-200" size={24} />
          <h3 className="mt-4 text-lg font-black text-white">Thiết lập tài khoản</h3>
          <p className="text-muted mt-2 text-sm">Cập nhật avatar, thông tin cá nhân, email và số điện thoại.</p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-blue-200">
            Mở cài đặt
            <ChevronRight size={16} />
          </span>
        </Link>
      </section>

      <RecentlyViewedSection
        compact
        limit={6}
        showClearAction={false}
        subtitle="Những sản phẩm bạn vừa mở sẽ xuất hiện ở đây để quay lại nhanh."
        title="Sản phẩm đã xem"
      />

      <RecommendationSection
        badgeLabel="Dành cho bạn"
        compact
        placeholder
        placeholderMessage="Tiếp tục duyệt catalog, thêm vào wishlist hoặc giỏ hàng để các lựa chọn ở đây sát nhu cầu hơn."
        placeholderTitle="Sẵn sàng cá nhân hóa lựa chọn"
        subtitle="Các gợi ý phù hợp hơn sẽ xuất hiện khi tài khoản có thêm tín hiệu mua sắm."
        title="Gợi ý dành cho bạn"
      />
    </div>
  );
}

export default ProfileOverview;
