import { PackageSearch, RotateCcw, SearchX } from "lucide-react";
import EmptyState from "../ui/feedback/EmptyState";

function EmptyProductsState({ hasActiveFilters, onClearAll, search }) {
  return (
    <EmptyState
      actionIcon={RotateCcw}
      actionLabel={hasActiveFilters ? "Xóa tất cả bộ lọc" : null}
      eyebrow="Không tìm thấy sản phẩm"
      icon={search ? SearchX : PackageSearch}
      message={
        search
          ? `Không có sản phẩm nào khớp với "${search}". Thử từ khóa ngắn hơn hoặc bỏ bớt bộ lọc đang chọn.`
          : "Bộ lọc hiện tại chưa khớp sản phẩm nào trong danh sách. Xóa bớt điều kiện để mở rộng kết quả."
      }
      onAction={onClearAll}
      secondaryActionLabel={hasActiveFilters ? "Xem toàn bộ catalog" : null}
      secondaryActionTo="/products"
      surface="store"
      title="Không có sản phẩm phù hợp"
    />
  );
}

export default EmptyProductsState;
