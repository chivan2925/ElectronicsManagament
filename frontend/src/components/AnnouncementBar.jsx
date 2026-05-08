import { Headphones, ShieldCheck, Truck } from "lucide-react";

function AnnouncementBar() {
  const items = [
    { icon: Truck, text: "Miễn phí giao hàng đơn từ 500.000đ", tone: "text-amber-300" },
    { icon: ShieldCheck, text: "Bảo hành chính hãng 100%", tone: "text-emerald-300" },
    { icon: Headphones, text: "Hỗ trợ 24/7: 1900 1234", tone: "text-blue-300" },
  ];

  return (
    <div className="border-b border-slate-800 bg-[#050B14] text-xs text-slate-300">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-4 py-2 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div className="flex items-center justify-center gap-2" key={item.text}>
              <Icon className={item.tone} size={15} />
              <span>{item.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AnnouncementBar;
