import logo from "../../../assets/logo.png";

export default function Footer() {
    return (
        <footer className="text-white bg-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-4 bg-dark">
                    <img src={logo} alt="PCE Logo" className="h-52 w-auto object-cover" />
                </div>
                
                <div>
                    <h3 className="text-xl font-semibold uppercase">Sản phẩm</h3>
                    <ul className="mt-4 space-y-2">
                        <li><a href="#" className="text-base text-gray-300 hover:text-white">Laptop</a></li>
                        <li><a href="#" className="text-base text-gray-300 hover:text-white">PC Gaming</a></li>
                        <li><a href="#" className="text-base text-gray-300 hover:text-white">Linh kiện</a></li>
                        <li><a href="#" className="text-base text-gray-300 hover:text-white">Phụ kiện</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-xl font-semibold uppercase">Về chúng tôi</h3>
                    <ul className="mt-4 space-y-2">
                        <li><a href="#" className="text-base text-gray-300 hover:text-white">Tuyển dụng</a></li>
                        <li><a href="#" className="text-base text-gray-300 hover:text-white">Hệ thống cửa hàng</a></li>
                        <li><a href="#" className="text-base text-gray-300 hover:text-white">Chính sách bảo mật</a></li>
                    </ul>
                </div>
                
                <div>
                    <h3 className="text-xl font-semibold uppercase">Hỗ trợ</h3>
                    <ul className="mt-4 space-y-2">
                        <li><a href="#" className="text-base text-gray-300 hover:text-white">Hướng dẫn mua hàng</a></li>
                        <li><a href="#" className="text-base text-gray-300 hover:text-white">Chính sách bảo hành</a></li>
                        <li><a href="#" className="text-base text-gray-300 hover:text-white">Liên hệ</a></li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 py-6 border-t border-gray-800 text-center">
                <p className="text-gray-400 text-sm">&copy; 2026 PCE - Electronics. All Rights Reserved.</p>
            </div>
        </footer>
    );
}