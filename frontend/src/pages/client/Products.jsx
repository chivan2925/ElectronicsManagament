import ClientPlaceholderPage from "../../components/common/ClientPlaceholderPage";

function Products() {
  return (
    <ClientPlaceholderPage
      badge="DANH SÁCH SẢN PHẨM"
      features={["Lọc theo danh mục", "Sắp xếp giá và đánh giá", "Tìm kiếm nhanh", "Card sản phẩm đồng bộ"]}
      primaryLabel="Xem sản phẩm nổi bật"
      subtitle="Trang danh sách sản phẩm sẽ hiển thị toàn bộ thiết bị điện tử và gaming theo danh mục, thương hiệu, mức giá và tồn kho."
      title="Khám phá sản phẩm gaming và điện tử"
    />
  );
}

export default Products;
