import { Headphones, ShieldCheck, Truck } from "lucide-react";

function AnnouncementBar() {
  const items = [
    { icon: Truck, text: "Miễn phí giao hàng đơn từ 500.000đ", tone: "text-amber-300" },
    { icon: ShieldCheck, text: "Bảo hành chính hãng 100%", tone: "text-emerald-300" },
    { icon: Headphones, text: "Hỗ trợ 24/7: 1900 1234", tone: "text-blue-300" },
  ];

  return (
    <div className="border-b border-white/10 bg-[#050B14]/90 text-xs text-slate-300 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-4 py-2 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div className="premium-transition flex items-center justify-center gap-2 rounded-full px-2 py-1 hover:bg-white/[0.04]" key={item.text}>
              <Icon className={`${item.tone} drop-shadow-[0_0_10px_rgba(59,130,246,0.55)]`} size={15} />
              <span className="font-medium">{item.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AnnouncementBar;
