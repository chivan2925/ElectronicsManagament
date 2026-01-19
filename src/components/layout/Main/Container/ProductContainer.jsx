import { useState } from "react";
import ProductCard from "../../../common/ProductCard";
import lap1 from "../../../../assets/lap1.png";
import lap2 from "../../../../assets/lap2.png";
import Pagination from "../../../common/Pagination";

export default function ProductContainer() {
  const allProducts = [
    {
      id: 1,
      name: "RAM Kingston Fury Beast 16GB",
      price: "2.500.000đ",
      imageUrl: lap1,
    },
    {
      id: 2,
      name: "CPU Intel Core i9-13900K",
      price: "15.000.000đ",
      imageUrl: lap2,
    },
    { id: 3, name: "VGA RTX 4090", price: "50.000.000đ" },
    { id: 4, name: "Laptop Gaming Acer Nitro 5", price: "25.000.000đ" },
    { id: 5, name: "Mainboard ASUS ROG STRIX Z790", price: "10.000.000đ" },
    { id: 6, name: "Ổ cứng SSD Samsung 980 Pro 1TB", price: "3.000.000đ" },
    { id: 7, name: "Nguồn Corsair RM850x", price: "4.000.000đ" },
    { id: 8, name: "Tản nhiệt nước Cooler Master", price: "3.500.000đ" },
    { id: 9, name: "Product 9", price: "1.000.000đ" },
    { id: 10, name: "Product 10", price: "1.000.000đ" },
    { id: 11, name: "Product 11", price: "1.000.000đ" },
    { id: 12, name: "Product 12", price: "1.000.000đ" },
  ];

  const [page, setPage] = useState(1);
  const pageSize = 8;

  const end = page * pageSize;
  const start = end - pageSize;
  const pageItems = allProducts.slice(start, end);

  const paginate = (pageNumber) => setPage(pageNumber);

  return (
    <div className="bg-dark py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white mb-8">
          Tất cả sản phẩm
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {pageItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <Pagination
          pageSize={pageSize}
          totalItems={allProducts.length}
          onPageChange={paginate}
          page={page}
        />
      </div>
    </div>
  );
}
