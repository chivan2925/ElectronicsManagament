import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { Mail, Phone, MapPin } from "lucide-react";
import Container from "../ui/Container";

function Footer() {
  return (
    <footer className="mt-16 border-t border-white/5 bg-[#07111F] pt-16 pb-12">
      <Container>
        <div className="grid gap-12 md:grid-cols-3">
          {/* Column 1: Brand & About */}
          <div className="space-y-6">
            <Link to="/" className="text-2xl font-black tracking-tighter text-white">
              ELECTRONICS<span className="text-blue-500">MANAGEMENT</span>
            </Link>
            <p className="text-muted leading-relaxed max-w-sm">
              Hệ thống bán lẻ gaming gear và linh kiện PC hàng đầu Việt Nam. Cung cấp trải nghiệm mua sắm hiện đại với kho hàng đa dạng và dịch vụ chuyên nghiệp.
            </p>
            <div className="flex gap-4">
              {[FaFacebook, FaInstagram, FaTwitter, FaYoutube].map((Icon, i) => (
                <a key={i} href="#" className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-400 transition-all hover:bg-blue-500 hover:text-white">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-white">Khám phá</h3>
            <ul className="grid grid-cols-2 gap-y-4 gap-x-8">
              {[
                { label: "Sản phẩm", to: "/products" },
                { label: "Laptop", to: "/categories/laptop" },
                { label: "PC Gaming", to: "/categories/pc-gaming" },
                { label: "Linh kiện", to: "/categories/linh-kien-pc" },
                { label: "Bàn phím", to: "/categories/ban-phim" },
                { label: "Chuột", to: "/categories/chuot" },
                { label: "Tai nghe", to: "/categories/tai-nghe" },
                { label: "Ghế gaming", to: "/categories/ghe-gaming" },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-muted transition-all hover:text-blue-400 hover:translate-x-1 inline-block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white">Liên hệ</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="mt-1 shrink-0 text-blue-500" size={18} />
                <span className="text-muted">123 Đường Game Thủ, Quận 7, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="shrink-0 text-blue-500" size={18} />
                <span className="text-muted">1900 1234 (8:00 - 21:00)</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="shrink-0 text-blue-500" size={18} />
                <span className="text-muted">contact@electronicsmanagament.vn</span>
              </li>
            </ul>
            <div className="rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/5">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Đăng ký bản tin</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Email của bạn" 
                  className="flex-1 rounded-xl bg-white/5 border-none px-4 py-2 text-sm focus:ring-1 focus:ring-blue-500"
                />
                <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-500 transition-colors">
                  Gửi
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-8 md:flex-row">
          <p className="text-sm text-slate-500">
            © 2026 ElectronicsManagement. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-slate-500 hover:text-blue-400">Chính sách bảo mật</a>
            <a href="#" className="text-xs text-slate-500 hover:text-blue-400">Điều khoản dịch vụ</a>
            <a href="#" className="text-xs text-slate-500 hover:text-blue-400">Chính sách hoàn tiền</a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
