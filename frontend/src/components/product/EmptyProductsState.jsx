import { PackageSearch, RotateCcw, SearchX, Sparkles } from "lucide-react";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

function EmptyProductsState({ hasActiveFilters, onClearAll, search }) {
  return (
    <div className="relative isolate overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_50%_0%,rgba(0,91,255,0.2),transparent_42%),linear-gradient(180deg,rgba(15,23,42,0.84),rgba(7,17,31,0.96))] p-6 text-center shadow-[0_22px_70px_rgba(0,0,0,0.28)] sm:p-8">
      <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-blue-200/50 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-8 h-28 w-28 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-200/20 bg-blue-500/12 text-blue-100 shadow-[0_0_32px_rgba(0,91,255,0.24)]">
        {search ? <SearchX size={34} /> : <PackageSearch size={34} />}
      </div>

      <Badge className="mx-auto mt-5 gap-2" variant="primary">
        <Sparkles size={13} />
        Không tìm thấy sản phẩm
      </Badge>

      <h3 className="text-section mt-4">Không có sản phẩm phù hợp</h3>
      <p className="text-muted mx-auto mt-2 max-w-md text-sm">
        {search
          ? `Không có sản phẩm nào khớp với "${search}". Thử từ khóa ngắn hơn hoặc bỏ bớt bộ lọc đang chọn.`
          : "Bộ lọc hiện tại chưa khớp sản phẩm nào trong catalog. Xóa bớt điều kiện để mở rộng danh sách."}
      </p>

      {hasActiveFilters && (
        <Button className="mt-5" onClick={onClearAll} variant="outline">
          <RotateCcw size={16} />
          Xóa tất cả bộ lọc
        </Button>
      )}
    </div>
  );
}

export default EmptyProductsState;
