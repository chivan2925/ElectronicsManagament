import { useParams } from "react-router-dom";
import ClientPlaceholderPage from "../../components/common/ClientPlaceholderPage";

function ProductDetail() {
  const { slug } = useParams();

  return (
    <ClientPlaceholderPage
      badge="CHI TIẾT SẢN PHẨM"
      features={["Ảnh sản phẩm", "Biến thể và tồn kho", "Thông số kỹ thuật", "Gợi ý sản phẩm liên quan"]}
      primaryLabel="Quay lại danh sách"
      subtitle={`Trang chi tiết cho sản phẩm "${slug}" sẽ hiển thị thông tin, giá, biến thể, media và CTA thêm vào giỏ hàng.`}
      title="Trang chi tiết sản phẩm"
    />
  );
}

export default ProductDetail;
