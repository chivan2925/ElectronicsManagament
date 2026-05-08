import React, { useState } from 'react';
import { Star, Eye, EyeOff, Filter, MessageSquare } from 'lucide-react';

// Dữ liệu mẫu (Mock Data) dựa trên cấu trúc DB của bạn
const initialReviews = [
  { id: 1, product_id: 101, user_id: 50, star: 5, content: "Sản phẩm tuyệt vời, đóng gói kỹ!", status: "active", created_at: "2024-03-20 10:00" },
  { id: 2, product_id: 102, user_id: 51, star: 2, content: "Giao hàng hơi chậm, sản phẩm bị móp nhẹ.", status: "active", created_at: "2024-03-21 14:30" },
  { id: 3, product_id: 101, user_id: 52, star: 4, content: "Chất lượng ổn trong tầm giá.", status: "hidden", created_at: "2024-03-22 09:15" },
  { id: 4, product_id: 105, user_id: 53, star: 1, content: "Hàng giả, đừng mua mọi người ơi!", status: "active", created_at: "2024-03-23 16:45" },
];

const ReviewManagement = () => {
  const [reviews, setReviews] = useState(initialReviews);
  const [filterStar, setFilterStar] = useState(0); // 0 là hiển thị tất cả

  // Hàm thay đổi trạng thái ẩn/hiện
  const toggleStatus = (id) => {
    setReviews(reviews.map(review => 
      review.id === id 
        ? { ...review, status: review.status === 'active' ? 'hidden' : 'active' } 
        : review
    ));
  };

  // Lọc dữ liệu theo số sao
  const filteredReviews = filterStar === 0 
    ? reviews 
    : reviews.filter(r => r.star === filterStar);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        
        {/* Header & Filter */}
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <MessageSquare className="text-blue-600" /> Quản lý đánh giá
            </h1>
            <p className="text-sm text-gray-500">Xem và kiểm duyệt đánh giá từ khách hàng</p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
              <Filter size={16} /> Lọc theo:
            </label>
            <select 
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={filterStar}
              onChange={(e) => setFilterStar(Number(e.target.value))}
            >
              <option value={0}>Tất cả số sao</option>
              {[5, 4, 3, 2, 1].map(num => (
                <option key={num} value={num}>{num} sao</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                <th className="px-6 py-4">ID / Ngày</th>
                <th className="px-6 py-4">Sản phẩm/User</th>
                <th className="px-6 py-4">Đánh giá</th>
                <th className="px-6 py-4">Nội dung</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review) => (
                  <tr key={review.id} className={`hover:bg-gray-50 transition-colors ${review.status === 'hidden' ? 'bg-gray-50/50' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">#{review.id}</div>
                      <div className="text-xs text-gray-400">{review.created_at}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 font-medium">Pro-ID: {review.product_id}</div>
                      <div className="text-xs text-blue-500 underline">User: {review.user_id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={14} 
                            fill={i < review.star ? "#f59e0b" : "none"} 
                            className={i < review.star ? "text-amber-500" : "text-gray-300"}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 max-w-xs truncate" title={review.content}>
                        {review.content}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        review.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {review.status === 'active' ? 'Hiển thị' : 'Đã ẩn'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => toggleStatus(review.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          review.status === 'active' 
                            ? 'text-gray-400 hover:text-red-500 hover:bg-red-50' 
                            : 'text-gray-400 hover:text-green-500 hover:bg-green-50'
                        }`}
                        title={review.status === 'active' ? "Ẩn đánh giá" : "Hiện đánh giá"}
                      >
                        {review.status === 'active' ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-400 italic">
                    Không tìm thấy đánh giá nào với {filterStar} sao.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 flex justify-between">
          <span>Tổng cộng: {filteredReviews.length} đánh giá</span>
          <span>Dữ liệu cập nhật thời gian thực</span>
        </div>
      </div>
    </div>
  );
};

export default ReviewManagement;