  BEGIN;




  -- =========================================================
  -- SAMPLE DATA FOR electronics_management - PostgreSQL
  -- Run order sau khi drop database:
  -- 1) Tạo lại database electronics_management.
  -- 2) Start backend một lần với ddl-auto=update để Hibernate tạo schema hiện tại.
  -- 3) Chạy file này vào database vừa tạo.
  -- Danh mục đã viết hoa chữ cái đầu theo yêu cầu UI.
  -- Script này reset dữ liệu mẫu để tránh lỗi trùng unique/foreign key khi chạy lại.
  -- =========================================================




  TRUNCATE TABLE
    cart_items, carts,
    warehouse_transaction_details, warehouse_transactions, warehouse_details,
    payment_transactions, return_requests, reviews, order_details, orders,
    addresses, media, variants, products, coupons,
    role_permissions, permissions, staffs, roles, users,
    warehouses, categories, brands, invalidated_tokens
  RESTART IDENTITY CASCADE;




  -- =====================
  -- PEOPLE AND ACCESS
  -- =====================




  INSERT INTO roles (id, name, status, created_at, updated_at) VALUES
  (1, 'ADMIN', 'ACTIVE', NOW(), NOW()),
  (2, 'MANAGER', 'ACTIVE', NOW(), NOW()),
  (3, 'WAREHOUSE_STAFF', 'ACTIVE', NOW(), NOW()),
  (4, 'SALES_STAFF', 'ACTIVE', NOW(), NOW()),
  (5, 'SUPPORT_STAFF', 'ACTIVE', NOW(), NOW());




  INSERT INTO permissions (id, code, name, description, created_at, updated_at) VALUES
  (1, 'dashboard:view', 'Xem dashboard', 'Xem tổng quan vận hành admin', NOW(), NOW()),
  (2, 'category:view', 'Xem danh mục', 'Xem danh sách danh mục', NOW(), NOW()),
  (3, 'category:create', 'Tạo danh mục', 'Thêm danh mục mới', NOW(), NOW()),
  (4, 'category:update', 'Sửa danh mục', 'Cập nhật danh mục', NOW(), NOW()),
  (5, 'category:delete', 'Xóa danh mục', 'Xóa hoặc ẩn danh mục', NOW(), NOW()),
  (6, 'brand:view', 'Xem thương hiệu', 'Xem danh sách thương hiệu', NOW(), NOW()),
  (7, 'brand:create', 'Tạo thương hiệu', 'Thêm thương hiệu mới', NOW(), NOW()),
  (8, 'brand:update', 'Sửa thương hiệu', 'Cập nhật thương hiệu', NOW(), NOW()),
  (9, 'brand:delete', 'Xóa thương hiệu', 'Xóa hoặc ẩn thương hiệu', NOW(), NOW()),
  (10, 'product:view', 'Xem sản phẩm', 'Xem danh sách sản phẩm', NOW(), NOW()),
  (11, 'product:create', 'Tạo sản phẩm', 'Thêm sản phẩm mới', NOW(), NOW()),
  (12, 'product:update', 'Sửa sản phẩm', 'Cập nhật sản phẩm', NOW(), NOW()),
  (13, 'product:delete', 'Xóa sản phẩm', 'Xóa hoặc ẩn sản phẩm', NOW(), NOW()),
  (14, 'variant:view', 'Xem phiên bản', 'Xem biến thể sản phẩm', NOW(), NOW()),
  (15, 'variant:create', 'Tạo phiên bản', 'Thêm biến thể sản phẩm', NOW(), NOW()),
  (16, 'variant:update', 'Sửa phiên bản', 'Cập nhật biến thể sản phẩm', NOW(), NOW()),
  (17, 'variant:delete', 'Xóa phiên bản', 'Xóa hoặc ẩn biến thể sản phẩm', NOW(), NOW()),
  (18, 'media:view', 'Xem media', 'Xem thư viện media', NOW(), NOW()),
  (19, 'media:create', 'Tạo media', 'Tải media mới', NOW(), NOW()),
  (20, 'media:update', 'Sửa media', 'Cập nhật media', NOW(), NOW()),
  (21, 'media:delete', 'Xóa media', 'Xóa media', NOW(), NOW()),
  (22, 'order:view', 'Xem đơn hàng', 'Xem đơn hàng', NOW(), NOW()),
  (23, 'order:create', 'Tạo đơn hàng', 'Tạo đơn hàng hộ khách', NOW(), NOW()),
  (24, 'order:update', 'Sửa đơn hàng', 'Cập nhật trạng thái đơn hàng', NOW(), NOW()),
  (25, 'order:delete', 'Xóa đơn hàng', 'Xóa đơn hàng', NOW(), NOW()),
  (26, 'coupon:view', 'Xem khuyến mãi', 'Xem mã giảm giá', NOW(), NOW()),
  (27, 'coupon:create', 'Tạo khuyến mãi', 'Thêm mã giảm giá', NOW(), NOW()),
  (28, 'coupon:update', 'Sửa khuyến mãi', 'Cập nhật mã giảm giá', NOW(), NOW()),
  (29, 'coupon:delete', 'Xóa khuyến mãi', 'Xóa mã giảm giá', NOW(), NOW()),
  (30, 'warehouse:view', 'Xem kho', 'Xem kho và tồn kho', NOW(), NOW()),
  (31, 'warehouse:create', 'Tạo kho', 'Thêm kho hoặc phiếu kho', NOW(), NOW()),
  (32, 'warehouse:update', 'Sửa kho', 'Cập nhật kho hoặc phiếu kho', NOW(), NOW()),
  (33, 'warehouse:delete', 'Xóa kho', 'Xóa hoặc ẩn kho', NOW(), NOW()),
  (34, 'payment:view', 'Xem thanh toán', 'Xem giao dịch thanh toán', NOW(), NOW()),
  (35, 'return-request:view', 'Xem đổi trả', 'Xem yêu cầu đổi trả', NOW(), NOW()),
  (36, 'return-request:update', 'Sửa đổi trả', 'Cập nhật yêu cầu đổi trả', NOW(), NOW()),
  (37, 'revenue-report:view', 'Xem doanh thu', 'Xem báo cáo doanh thu', NOW(), NOW()),
  (38, 'best-seller-report:view', 'Xem bán chạy', 'Xem báo cáo sản phẩm bán chạy', NOW(), NOW()),
  (39, 'activity-log:view', 'Xem nhật ký', 'Xem nhật ký hoạt động', NOW(), NOW()),
  (40, 'user:view', 'Xem người dùng', 'Xem tài khoản khách hàng', NOW(), NOW()),
  (41, 'user:update', 'Sửa người dùng', 'Cập nhật tài khoản khách hàng', NOW(), NOW()),
  (42, 'staff:view', 'Xem nhân viên', 'Xem tài khoản nhân viên', NOW(), NOW()),
  (43, 'role:view', 'Xem vai trò', 'Xem vai trò và quyền', NOW(), NOW()),
  (44, 'role:manage', 'Quản lý vai trò', 'Quản lý vai trò và quyền', NOW(), NOW());




  INSERT INTO role_permissions (role_id, permission_id)
  SELECT 1, id FROM permissions;

  INSERT INTO role_permissions (role_id, permission_id)
  SELECT 2, id
  FROM permissions
  WHERE code IN (
    'dashboard:view', 'category:view', 'category:create', 'category:update',
    'brand:view', 'brand:create', 'brand:update',
    'product:view', 'product:create', 'product:update',
    'variant:view', 'variant:create', 'variant:update',
    'media:view', 'media:create', 'media:update',
    'order:view', 'order:update',
    'coupon:view', 'coupon:create', 'coupon:update',
    'warehouse:view', 'warehouse:create', 'warehouse:update',
    'payment:view', 'return-request:view', 'return-request:update',
    'revenue-report:view', 'best-seller-report:view', 'activity-log:view'
  );

  INSERT INTO role_permissions (role_id, permission_id)
  SELECT 3, id
  FROM permissions
  WHERE code IN (
    'dashboard:view', 'product:view', 'variant:view',
    'order:view', 'warehouse:view', 'warehouse:create', 'warehouse:update'
  );

  INSERT INTO role_permissions (role_id, permission_id)
  SELECT 4, id
  FROM permissions
  WHERE code IN (
    'dashboard:view', 'category:view', 'brand:view', 'product:view', 'variant:view',
    'order:view', 'order:update', 'coupon:view', 'payment:view',
    'revenue-report:view', 'best-seller-report:view'
  );

  INSERT INTO role_permissions (role_id, permission_id)
  SELECT 5, id
  FROM permissions
  WHERE code IN (
    'dashboard:view', 'product:view', 'variant:view',
    'order:view', 'order:update', 'return-request:view', 'return-request:update'
  );




  INSERT INTO users (id, full_name, gender, date_of_birth, username, avatar_url, email, phone_number, hashed_password, status, created_at, updated_at) VALUES
  (1, 'Nguyễn Văn An', 'MALE', '2001-05-20', 'user01', 'https://ui-avatars.com/api/?name=Nguyen+Van+An', 'user01@gmail.com', '0911111111', '$2a$10$cA6U2LJSMmKq1wufof3SSOaRKLIgqqdASTku8P3bRIsDDjriS7sxm', 'ACTIVE', NOW(), NOW()),
  (2, 'Trần Thị Bình', 'FEMALE', '1999-08-12', 'user02', 'https://ui-avatars.com/api/?name=Tran+Thi+Binh', 'user02@gmail.com', '0911111112', '$2a$10$cA6U2LJSMmKq1wufof3SSOaRKLIgqqdASTku8P3bRIsDDjriS7sxm', 'ACTIVE', NOW(), NOW()),
  (3, 'Lê Minh Châu', 'FEMALE', '2000-03-15', 'user03', 'https://ui-avatars.com/api/?name=Le+Minh+Chau', 'user03@gmail.com', '0911111113', '$2a$10$cA6U2LJSMmKq1wufof3SSOaRKLIgqqdASTku8P3bRIsDDjriS7sxm', 'ACTIVE', NOW(), NOW()),
  (4, 'Phạm Quốc Dũng', 'MALE', '1998-11-30', 'user04', 'https://ui-avatars.com/api/?name=Pham+Quoc+Dung', 'user04@gmail.com', '0911111114', '$2a$10$cA6U2LJSMmKq1wufof3SSOaRKLIgqqdASTku8P3bRIsDDjriS7sxm', 'ACTIVE', NOW(), NOW()),
  (5, 'Hoàng Kim Em', 'FEMALE', '2002-01-10', 'user05', 'https://ui-avatars.com/api/?name=Hoang+Kim+Em', 'user05@gmail.com', '0911111115', '$2a$10$cA6U2LJSMmKq1wufof3SSOaRKLIgqqdASTku8P3bRIsDDjriS7sxm', 'ACTIVE', NOW(), NOW());

  INSERT INTO users (id, full_name, gender, date_of_birth, username, avatar_url, email, phone_number, hashed_password, status, created_at, updated_at)
  SELECT
    user_no,
    'Khách hàng Demo ' || LPAD(user_no::text, 2, '0'),
    CASE WHEN user_no % 3 = 0 THEN 'OTHER' WHEN user_no % 2 = 0 THEN 'FEMALE' ELSE 'MALE' END,
    DATE '1995-01-01' + (user_no * 47),
    'user' || LPAD(user_no::text, 2, '0'),
    'https://ui-avatars.com/api/?name=Demo+' || LPAD(user_no::text, 2, '0'),
    'user' || LPAD(user_no::text, 2, '0') || '@gmail.com',
    '09200000' || LPAD(user_no::text, 2, '0'),
    '$2a$10$cA6U2LJSMmKq1wufof3SSOaRKLIgqqdASTku8P3bRIsDDjriS7sxm',
    CASE WHEN user_no IN (24, 25) THEN 'BLOCKED' ELSE 'ACTIVE' END,
    NOW() - (user_no * INTERVAL '1 day'),
    NOW()
  FROM generate_series(6, 25) AS user_no;




  INSERT INTO staffs (id, full_name, gender, date_of_birth, username, avatar_url, email, phone_number, address, role_id, hashed_password, status, assigned_at, updated_at) VALUES
  (1, 'Quản trị viên', 'MALE', '2000-01-01', 'admin', 'https://ui-avatars.com/api/?name=Admin', 'admin@gmail.com', '0900000000', 'Hồ Chí Minh', 1, '$2a$10$cA6U2LJSMmKq1wufof3SSOaRKLIgqqdASTku8P3bRIsDDjriS7sxm', 'ACTIVE', NOW(), NOW()),
  (2, 'Nguyễn Quản Lý', 'MALE', '1994-04-18', 'manager01', 'https://ui-avatars.com/api/?name=Manager', 'manager01@gmail.com', '0900000001', 'Hà Nội', 2, '$2a$10$cA6U2LJSMmKq1wufof3SSOaRKLIgqqdASTku8P3bRIsDDjriS7sxm', 'ACTIVE', NOW(), NOW()),
  (3, 'Trần Nhân Kho', 'MALE', '1995-06-22', 'warehouse01', 'https://ui-avatars.com/api/?name=Warehouse', 'warehouse01@gmail.com', '0900000002', 'Đà Nẵng', 3, '$2a$10$cA6U2LJSMmKq1wufof3SSOaRKLIgqqdASTku8P3bRIsDDjriS7sxm', 'ACTIVE', NOW(), NOW()),
  (4, 'Lê Nhân Sale', 'FEMALE', '1997-02-02', 'sales01', 'https://ui-avatars.com/api/?name=Sales', 'sales01@gmail.com', '0900000003', 'Cần Thơ', 4, '$2a$10$cA6U2LJSMmKq1wufof3SSOaRKLIgqqdASTku8P3bRIsDDjriS7sxm', 'ACTIVE', NOW(), NOW()),
  (5, 'Phạm Hỗ Trợ', 'FEMALE', '1996-12-12', 'support01', 'https://ui-avatars.com/api/?name=Support', 'support01@gmail.com', '0900000004', 'Bình Dương', 5, '$2a$10$cA6U2LJSMmKq1wufof3SSOaRKLIgqqdASTku8P3bRIsDDjriS7sxm', 'ACTIVE', NOW(), NOW());




  INSERT INTO addresses (id, user_id, label, line, ward, district, province, note, is_default, created_at, updated_at) VALUES
  (1, 1, 'Nhà riêng', '12 Nguyễn Trãi', 'Phường Bến Thành', 'Quận 1', 'Hồ Chí Minh', 'Giao giờ hành chính', TRUE, NOW(), NOW()),
  (2, 2, 'Công ty', '45 Lê Lợi', 'Phường Bến Nghé', 'Quận 1', 'Hồ Chí Minh', 'Gọi trước khi giao', TRUE, NOW(), NOW()),
  (3, 3, 'Nhà', '78 Trần Phú', 'Phường 4', 'Quận 5', 'Hồ Chí Minh', NULL, TRUE, NOW(), NOW()),
  (4, 4, 'Văn phòng', '99 Cầu Giấy', 'Dịch Vọng', 'Cầu Giấy', 'Hà Nội', NULL, TRUE, NOW(), NOW()),
  (5, 5, 'Nhà', '101 Hải Phòng', 'Thạch Thang', 'Hải Châu', 'Đà Nẵng', 'Không giao buổi tối', TRUE, NOW(), NOW());

  INSERT INTO addresses (id, user_id, label, line, ward, district, province, note, is_default, created_at, updated_at)
  SELECT
    user_no,
    user_no,
    'Địa chỉ demo',
    'Số ' || (100 + user_no) || ' Đường Công Nghệ',
    'Phường ' || ((user_no % 12) + 1),
    CASE user_no % 4 WHEN 0 THEN 'Quận 1' WHEN 1 THEN 'Cầu Giấy' WHEN 2 THEN 'Hải Châu' ELSE 'Tân Bình' END,
    CASE user_no % 4 WHEN 0 THEN 'Hồ Chí Minh' WHEN 1 THEN 'Hà Nội' WHEN 2 THEN 'Đà Nẵng' ELSE 'Hồ Chí Minh' END,
    NULL,
    TRUE,
    NOW() - (user_no * INTERVAL '1 day'),
    NOW()
  FROM generate_series(6, 25) AS user_no;




  -- =====================
  -- CATALOG
  -- =====================




  INSERT INTO categories (id, name, icon_url, slug, parent_id, status, created_at, updated_at) VALUES
  (1, 'Điện thoại', 'https://example.com/icons/phone.png', 'dien-thoai', NULL, 'ACTIVE', NOW(), NOW()),
  (2, 'Laptop', 'https://example.com/icons/laptop.png', 'laptop', NULL, 'ACTIVE', NOW(), NOW()),
  (3, 'Tai nghe', 'https://example.com/icons/headphone.png', 'tai-nghe', NULL, 'ACTIVE', NOW(), NOW()),
  (4, 'Chuột', 'https://example.com/icons/mouse.png', 'chuot', NULL, 'ACTIVE', NOW(), NOW()),
  (5, 'Bàn phím', 'https://example.com/icons/keyboard.png', 'ban-phim', NULL, 'ACTIVE', NOW(), NOW()),
  (6, 'Lót chuột', 'https://example.com/icons/mousepad.png', 'lot-chuot', NULL, 'ACTIVE', NOW(), NOW()),
  (7, 'PC Gaming', 'https://example.com/icons/pc-gaming.png', 'pc-gaming', NULL, 'ACTIVE', NOW(), NOW()),
  (8, 'Máy bộ', 'https://example.com/icons/desktop.png', 'may-bo', NULL, 'ACTIVE', NOW(), NOW()),
  (9, 'Linh kiện PC', 'https://example.com/icons/pc-parts.png', 'linh-kien-pc', NULL, 'ACTIVE', NOW(), NOW()),
  (10, 'Ghế gaming', 'https://example.com/icons/gaming-chair.png', 'ghe-gaming', NULL, 'ACTIVE', NOW(), NOW()),
  (11, 'Phụ kiện gaming', 'https://example.com/icons/gaming-accessory.png', 'phu-kien-gaming', NULL, 'ACTIVE', NOW(), NOW());




  INSERT INTO brands
  (id, name, slug, image_url, description, featured, status, created_at, updated_at)
  VALUES
  (1, 'Apple', 'apple', 'https://example.com/brands/apple.png', 'Thương hiệu Apple.', TRUE, 'ACTIVE', NOW(), NOW()),
  (2, 'Dell', 'dell', 'https://example.com/brands/dell.png', 'Thương hiệu Dell.', TRUE, 'ACTIVE', NOW(), NOW()),
  (3, 'Logitech', 'logitech', 'https://example.com/brands/logitech.png', 'Thương hiệu Logitech.', TRUE, 'ACTIVE', NOW(), NOW()),
  (4, 'Razer', 'razer', 'https://example.com/brands/razer.png', 'Thương hiệu Razer.', TRUE, 'ACTIVE', NOW(), NOW()),
  (5, 'Corsair', 'corsair', 'https://example.com/brands/corsair.png', 'Thương hiệu Corsair.', TRUE, 'ACTIVE', NOW(), NOW()),
  (6, 'Samsung', 'samsung', 'https://example.com/brands/samsung.png', 'Thiết bị di động, màn hình và lưu trữ Samsung.', TRUE, 'ACTIVE', NOW(), NOW()),
  (7, 'Xiaomi', 'xiaomi', 'https://example.com/brands/xiaomi.png', 'Điện thoại và phụ kiện thông minh Xiaomi.', FALSE, 'ACTIVE', NOW(), NOW()),
  (8, 'Sony', 'sony', 'https://example.com/brands/sony.png', 'Âm thanh và thiết bị giải trí Sony.', TRUE, 'ACTIVE', NOW(), NOW()),
  (9, 'ASUS ROG', 'asus-rog', 'https://example.com/brands/asus-rog.png', 'Laptop, PC và linh kiện gaming ASUS ROG.', TRUE, 'ACTIVE', NOW(), NOW()),
  (10, 'MSI', 'msi', 'https://example.com/brands/msi.png', 'Laptop, PC và linh kiện gaming MSI.', TRUE, 'ACTIVE', NOW(), NOW()),
  (11, 'Lenovo', 'lenovo', 'https://example.com/brands/lenovo.png', 'Laptop, desktop và thiết bị doanh nghiệp Lenovo.', FALSE, 'ACTIVE', NOW(), NOW()),
  (12, 'HP', 'hp', 'https://example.com/brands/hp.png', 'Laptop và máy bộ HP.', FALSE, 'ACTIVE', NOW(), NOW()),
  (13, 'Acer Predator', 'acer-predator', 'https://example.com/brands/acer-predator.png', 'Laptop và màn hình gaming Acer Predator.', FALSE, 'ACTIVE', NOW(), NOW()),
  (14, 'SteelSeries', 'steelseries', 'https://example.com/brands/steelseries.png', 'Gear gaming SteelSeries.', FALSE, 'ACTIVE', NOW(), NOW()),
  (15, 'HyperX', 'hyperx', 'https://example.com/brands/hyperx.png', 'Tai nghe, bàn phím và phụ kiện HyperX.', FALSE, 'ACTIVE', NOW(), NOW()),
  (16, 'Kingston', 'kingston', 'https://example.com/brands/kingston.png', 'RAM và SSD Kingston.', FALSE, 'ACTIVE', NOW(), NOW()),
  (17, 'WD_BLACK', 'wd-black', 'https://example.com/brands/wd-black.png', 'SSD và lưu trữ gaming WD_BLACK.', FALSE, 'ACTIVE', NOW(), NOW()),
  (18, 'Intel', 'intel', 'https://example.com/brands/intel.png', 'CPU và nền tảng Intel.', TRUE, 'ACTIVE', NOW(), NOW()),
  (19, 'AMD', 'amd', 'https://example.com/brands/amd.png', 'CPU và nền tảng AMD Ryzen/Radeon.', TRUE, 'ACTIVE', NOW(), NOW()),
  (20, 'NVIDIA', 'nvidia', 'https://example.com/brands/nvidia.png', 'GPU và nền tảng đồ họa NVIDIA.', TRUE, 'ACTIVE', NOW(), NOW()),
  (21, 'Gigabyte', 'gigabyte', 'https://example.com/brands/gigabyte.png', 'Mainboard, VGA và linh kiện Gigabyte.', FALSE, 'ACTIVE', NOW(), NOW()),
  (22, 'Cooler Master', 'cooler-master', 'https://example.com/brands/cooler-master.png', 'Tản nhiệt, nguồn và case Cooler Master.', FALSE, 'ACTIVE', NOW(), NOW()),
  (23, 'Secretlab', 'secretlab', 'https://example.com/brands/secretlab.png', 'Ghế gaming và phụ kiện setup Secretlab.', TRUE, 'ACTIVE', NOW(), NOW()),
  (24, 'Keychron', 'keychron', 'https://example.com/brands/keychron.png', 'Bàn phím cơ và phụ kiện Keychron.', FALSE, 'ACTIVE', NOW(), NOW())
  ON CONFLICT (name) DO NOTHING;


  INSERT INTO products
  (id, name, slug, category_id, brand_id, description, specs_json, rating_star, rating_count, warranty_months, featured, status, created_at, updated_at)
  VALUES
  (1, 'iPhone 15 Pro Max', 'iphone-15-pro-max', 1, 1, 'Điện thoại cao cấp của Apple', '{"screen":"6.7 inch","chip":"A17 Pro","storage":"256GB"}', 4.8, 120, 12, TRUE, 'ACTIVE', NOW(), NOW()),
  (2, 'Dell XPS 13 Plus', 'dell-xps-13-plus', 2, 2, 'Laptop mỏng nhẹ cao cấp Dell XPS', '{"screen":"13.4 inch","cpu":"Intel Core i7","ram":"16GB","storage":"512GB"}', 4.6, 54, 12, TRUE, 'ACTIVE', NOW(), NOW()),
  (3, 'Logitech G733 Lightspeed', 'logitech-g733-lightspeed', 3, 3, 'Tai nghe gaming không dây Logitech', '{"type":"over-ear","connection":"wireless","battery":"29h"}', 4.7, 88, 12, TRUE, 'ACTIVE', NOW(), NOW()),
  (4, 'Logitech G Pro X Superlight 2', 'logitech-g-pro-x-superlight-2', 4, 3, 'Chuột gaming không dây siêu nhẹ', '{"dpi":"32000","weight":"60g","connection":"wireless"}', 4.8, 96, 12, TRUE, 'ACTIVE', NOW(), NOW()),
  (5, 'Razer BlackWidow V4', 'razer-blackwidow-v4', 5, 4, 'Bàn phím cơ gaming Razer', '{"switch":"Green Mechanical","layout":"Full-size","rgb":true}', 4.6, 61, 12, TRUE, 'ACTIVE', NOW(), NOW()),
  (6, 'Razer Gigantus V2 Large', 'razer-gigantus-v2-large', 6, 4, 'Lót chuột gaming bề mặt vải size Large', '{"size":"Large","surface":"cloth","antiSlip":true}', 4.5, 40, 6, FALSE, 'ACTIVE', NOW(), NOW()),
  (7, 'Alienware Aurora R16 Gaming PC', 'alienware-aurora-r16-gaming-pc', 7, 2, 'PC gaming Alienware thuộc thương hiệu Dell', '{"cpu":"Intel Core i7","gpu":"RTX 4070","ram":"32GB","storage":"1TB SSD"}', 4.7, 35, 24, TRUE, 'ACTIVE', NOW(), NOW()),
  (8, 'Dell OptiPlex 7010 Tower', 'dell-optiplex-7010-tower', 8, 2, 'Máy bộ văn phòng Dell ổn định', '{"cpu":"Intel Core i5","ram":"16GB","storage":"512GB SSD"}', 4.4, 29, 24, FALSE, 'ACTIVE', NOW(), NOW()),
  (9, 'Corsair Vengeance DDR5 32GB', 'corsair-vengeance-ddr5-32gb', 9, 5, 'RAM DDR5 hiệu năng cao cho PC', '{"capacity":"32GB","bus":"5600MHz","type":"DDR5"}', 4.6, 44, 36, FALSE, 'ACTIVE', NOW(), NOW()),
  (10, 'Razer Iskur V2 Gaming Chair', 'razer-iskur-v2-gaming-chair', 10, 4, 'Ghế gaming công thái học Razer', '{"material":"synthetic leather","lumbarSupport":true,"color":"black"}', 4.5, 33, 12, FALSE, 'ACTIVE', NOW(), NOW()),


  (11, 'iPhone 15 128GB', 'iphone-15-128gb', 1, 1, 'Điện thoại Apple iPhone 15 phiên bản 128GB', '{"screen":"6.1 inch","chip":"A16 Bionic","storage":"128GB","camera":"48MP"}', 4.7, 85, 12, TRUE, 'ACTIVE', NOW(), NOW()),
  (12, 'iPhone 15 Plus 256GB', 'iphone-15-plus-256gb', 1, 1, 'Điện thoại Apple iPhone 15 Plus màn hình lớn', '{"screen":"6.7 inch","chip":"A16 Bionic","storage":"256GB","battery":"long lasting"}', 4.6, 62, 12, TRUE, 'ACTIVE', NOW(), NOW()),
  (13, 'iPhone 14 Pro 128GB', 'iphone-14-pro-128gb', 1, 1, 'Điện thoại iPhone 14 Pro hiệu năng cao', '{"screen":"6.1 inch","chip":"A16 Bionic","storage":"128GB","camera":"Pro camera"}', 4.7, 103, 12, FALSE, 'ACTIVE', NOW(), NOW()),
  (14, 'iPhone 13 128GB', 'iphone-13-128gb', 1, 1, 'Điện thoại iPhone 13 phù hợp sử dụng hằng ngày', '{"screen":"6.1 inch","chip":"A15 Bionic","storage":"128GB"}', 4.5, 140, 12, FALSE, 'ACTIVE', NOW(), NOW()),
  (15, 'iPhone SE 2022 64GB', 'iphone-se-2022-64gb', 1, 1, 'Điện thoại iPhone SE nhỏ gọn', '{"screen":"4.7 inch","chip":"A15 Bionic","storage":"64GB"}', 4.3, 58, 12, FALSE, 'ACTIVE', NOW(), NOW()),


  (16, 'Dell Inspiron 15 3530', 'dell-inspiron-15-3530', 2, 2, 'Laptop Dell Inspiron dành cho học tập và văn phòng', '{"screen":"15.6 inch","cpu":"Intel Core i5","ram":"8GB","storage":"512GB SSD"}', 4.4, 76, 12, FALSE, 'ACTIVE', NOW(), NOW()),
  (17, 'Dell Vostro 3520', 'dell-vostro-3520', 2, 2, 'Laptop Dell Vostro bền bỉ cho doanh nghiệp nhỏ', '{"screen":"15.6 inch","cpu":"Intel Core i5","ram":"8GB","storage":"512GB SSD"}', 4.3, 49, 12, FALSE, 'ACTIVE', NOW(), NOW()),
  (18, 'Dell Latitude 5440', 'dell-latitude-5440', 2, 2, 'Laptop doanh nhân Dell Latitude bảo mật cao', '{"screen":"14 inch","cpu":"Intel Core i7","ram":"16GB","storage":"512GB SSD"}', 4.6, 37, 24, TRUE, 'ACTIVE', NOW(), NOW()),
  (19, 'Dell Precision 3581', 'dell-precision-3581', 2, 2, 'Laptop workstation Dell Precision cho thiết kế kỹ thuật', '{"screen":"15.6 inch","cpu":"Intel Core i7","ram":"32GB","storage":"1TB SSD","gpu":"NVIDIA RTX"}', 4.7, 21, 24, TRUE, 'ACTIVE', NOW(), NOW()),
  (20, 'Dell G15 5530 Gaming', 'dell-g15-5530-gaming', 2, 2, 'Laptop gaming Dell G15 hiệu năng mạnh', '{"screen":"15.6 inch 165Hz","cpu":"Intel Core i7","ram":"16GB","gpu":"RTX 4060"}', 4.6, 64, 24, TRUE, 'ACTIVE', NOW(), NOW()),


  (21, 'Logitech H390 USB Headset', 'logitech-h390-usb-headset', 3, 3, 'Tai nghe Logitech có micro chống ồn cho học tập và làm việc', '{"type":"on-ear","connection":"USB","microphone":true}', 4.2, 55, 12, FALSE, 'ACTIVE', NOW(), NOW()),
  (22, 'Logitech G435 Lightspeed', 'logitech-g435-lightspeed', 3, 3, 'Tai nghe gaming không dây Logitech G435', '{"type":"over-ear","connection":"wireless","battery":"18h"}', 4.4, 70, 12, FALSE, 'ACTIVE', NOW(), NOW()),
  (23, 'Logitech G Pro X Gaming Headset', 'logitech-g-pro-x-gaming-headset', 3, 3, 'Tai nghe gaming Logitech G Pro X âm thanh vòm', '{"type":"over-ear","connection":"wired","surround":"7.1"}', 4.7, 92, 12, TRUE, 'ACTIVE', NOW(), NOW()),
  (24, 'Razer BlackShark V2 X', 'razer-blackshark-v2-x', 3, 4, 'Tai nghe gaming Razer BlackShark V2 X', '{"type":"over-ear","connection":"wired","driver":"50mm"}', 4.5, 86, 12, FALSE, 'ACTIVE', NOW(), NOW()),
  (25, 'Razer Barracuda X Wireless', 'razer-barracuda-x-wireless', 3, 4, 'Tai nghe gaming không dây đa nền tảng Razer', '{"type":"over-ear","connection":"wireless","battery":"50h"}', 4.6, 48, 12, TRUE, 'ACTIVE', NOW(), NOW()),


  (26, 'Logitech M331 Silent Plus', 'logitech-m331-silent-plus', 4, 3, 'Chuột không dây Logitech giảm tiếng ồn khi click', '{"dpi":"1000","connection":"wireless","silent":true}', 4.4, 120, 12, FALSE, 'ACTIVE', NOW(), NOW()),
  (27, 'Logitech MX Master 3S', 'logitech-mx-master-3s', 4, 3, 'Chuột không dây cao cấp cho làm việc chuyên nghiệp', '{"dpi":"8000","connection":"bluetooth","silent":true}', 4.8, 99, 12, TRUE, 'ACTIVE', NOW(), NOW()),
  (28, 'Logitech G502 X Plus', 'logitech-g502-x-plus', 4, 3, 'Chuột gaming không dây Logitech G502 X Plus', '{"dpi":"25600","connection":"wireless","rgb":true}', 4.7, 73, 12, TRUE, 'ACTIVE', NOW(), NOW()),
  (29, 'Razer DeathAdder V3', 'razer-deathadder-v3', 4, 4, 'Chuột gaming ergonomic Razer DeathAdder V3', '{"dpi":"30000","weight":"59g","connection":"wired"}', 4.7, 68, 12, TRUE, 'ACTIVE', NOW(), NOW()),
  (30, 'Razer Basilisk V3', 'razer-basilisk-v3', 4, 4, 'Chuột gaming Razer Basilisk V3 nhiều nút tùy chỉnh', '{"dpi":"26000","buttons":"11","rgb":true}', 4.6, 57, 12, FALSE, 'ACTIVE', NOW(), NOW()),


  (31, 'Logitech K380 Bluetooth Keyboard', 'logitech-k380-bluetooth-keyboard', 5, 3, 'Bàn phím Bluetooth nhỏ gọn Logitech K380', '{"layout":"Compact","connection":"Bluetooth","multiDevice":true}', 4.5, 82, 12, FALSE, 'ACTIVE', NOW(), NOW()),
  (32, 'Logitech MX Keys S', 'logitech-mx-keys-s', 5, 3, 'Bàn phím không dây cao cấp Logitech MX Keys S', '{"layout":"Full-size","connection":"Bluetooth","backlight":true}', 4.7, 66, 12, TRUE, 'ACTIVE', NOW(), NOW()),
  (33, 'Logitech G Pro X TKL', 'logitech-g-pro-x-tkl', 5, 3, 'Bàn phím cơ gaming Logitech G Pro X TKL', '{"layout":"TKL","switch":"GX Brown","rgb":true}', 4.6, 41, 12, TRUE, 'ACTIVE', NOW(), NOW()),
  (34, 'Razer Huntsman V2 TKL', 'razer-huntsman-v2-tkl', 5, 4, 'Bàn phím gaming Razer Huntsman V2 TKL', '{"layout":"TKL","switch":"Optical","rgb":true}', 4.7, 39, 12, TRUE, 'ACTIVE', NOW(), NOW()),
  (35, 'Corsair K70 RGB MK.2', 'corsair-k70-rgb-mk2', 5, 5, 'Bàn phím cơ Corsair K70 RGB MK.2', '{"layout":"Full-size","switch":"Cherry MX","rgb":true}', 4.6, 45, 24, FALSE, 'ACTIVE', NOW(), NOW()),


  (36, 'Logitech Studio Series Desk Mat', 'logitech-studio-series-desk-mat', 6, 3, 'Lót chuột kiêm desk mat Logitech Studio Series', '{"size":"Large","surface":"cloth","waterResistant":true}', 4.4, 34, 6, FALSE, 'ACTIVE', NOW(), NOW()),
  (37, 'Razer Strider Large', 'razer-strider-large', 6, 4, 'Lót chuột gaming hybrid Razer Strider Large', '{"size":"Large","surface":"hybrid","antiSlip":true}', 4.6, 43, 6, FALSE, 'ACTIVE', NOW(), NOW()),
  (38, 'Corsair MM300 Pro Extended', 'corsair-mm300-pro-extended', 6, 5, 'Lót chuột Corsair MM300 Pro kích thước Extended', '{"size":"Extended","surface":"cloth","spillProof":true}', 4.5, 28, 6, FALSE, 'ACTIVE', NOW(), NOW()),
  (39, 'Razer Firefly V2', 'razer-firefly-v2', 6, 4, 'Lót chuột Razer Firefly V2 có RGB', '{"size":"Medium","surface":"hard","rgb":true}', 4.4, 24, 6, FALSE, 'ACTIVE', NOW(), NOW()),
  (40, 'Logitech G PowerPlay', 'logitech-g-powerplay', 6, 3, 'Lót chuột sạc không dây Logitech PowerPlay', '{"size":"Medium","wirelessCharging":true,"compatible":"Logitech G"}', 4.7, 31, 12, TRUE, 'ACTIVE', NOW(), NOW()),


  (41, 'Alienware Aurora R15 Gaming PC', 'alienware-aurora-r15-gaming-pc', 7, 2, 'PC gaming Alienware thuộc thương hiệu Dell', '{"cpu":"Intel Core i7","gpu":"RTX 4070 Ti","ram":"32GB","storage":"1TB SSD"}', 4.7, 26, 24, TRUE, 'ACTIVE', NOW(), NOW()),
  (42, 'Dell G5 Gaming Desktop', 'dell-g5-gaming-desktop', 7, 2, 'PC gaming Dell G5 phù hợp game thủ phổ thông', '{"cpu":"Intel Core i5","gpu":"RTX 3060","ram":"16GB","storage":"512GB SSD"}', 4.4, 33, 24, FALSE, 'ACTIVE', NOW(), NOW()),
  (43, 'Corsair Vengeance i7400 Gaming PC', 'corsair-vengeance-i7400-gaming-pc', 7, 5, 'PC gaming Corsair Vengeance i7400 hiệu năng cao', '{"cpu":"Intel Core i7","gpu":"RTX 4080","ram":"32GB","storage":"2TB SSD"}', 4.8, 19, 24, TRUE, 'ACTIVE', NOW(), NOW()),
  (44, 'Corsair One i500 Gaming PC', 'corsair-one-i500-gaming-pc', 7, 5, 'PC gaming Corsair One i500 thiết kế nhỏ gọn', '{"cpu":"Intel Core i9","gpu":"RTX 4090","ram":"64GB","storage":"2TB SSD"}', 4.9, 12, 24, TRUE, 'ACTIVE', NOW(), NOW()),
  (45, 'Razer Tomahawk Gaming Desktop', 'razer-tomahawk-gaming-desktop', 7, 4, 'PC gaming Razer Tomahawk thiết kế hiện đại', '{"cpu":"Intel Core i7","gpu":"RTX 4070","ram":"32GB","storage":"1TB SSD"}', 4.6, 17, 24, FALSE, 'ACTIVE', NOW(), NOW()),


  (46, 'Dell OptiPlex 3000 Micro', 'dell-optiplex-3000-micro', 8, 2, 'Máy bộ Dell OptiPlex nhỏ gọn cho văn phòng', '{"cpu":"Intel Core i3","ram":"8GB","storage":"256GB SSD","form":"Micro"}', 4.3, 44, 24, FALSE, 'ACTIVE', NOW(), NOW()),
  (47, 'Dell OptiPlex 5000 SFF', 'dell-optiplex-5000-sff', 8, 2, 'Máy bộ Dell OptiPlex SFF tiết kiệm không gian', '{"cpu":"Intel Core i5","ram":"16GB","storage":"512GB SSD","form":"SFF"}', 4.4, 38, 24, FALSE, 'ACTIVE', NOW(), NOW()),
  (48, 'Dell OptiPlex 7000 Tower', 'dell-optiplex-7000-tower', 8, 2, 'Máy bộ Dell OptiPlex Tower hiệu năng cao', '{"cpu":"Intel Core i7","ram":"16GB","storage":"1TB SSD","form":"Tower"}', 4.5, 27, 24, FALSE, 'ACTIVE', NOW(), NOW()),
  (49, 'Dell Precision 3660 Tower', 'dell-precision-3660-tower', 8, 2, 'Máy trạm Dell Precision 3660 Tower', '{"cpu":"Intel Core i7","ram":"32GB","storage":"1TB SSD","gpu":"NVIDIA RTX"}', 4.7, 20, 24, TRUE, 'ACTIVE', NOW(), NOW()),
  (50, 'Dell Wyse 5070 Thin Client', 'dell-wyse-5070-thin-client', 8, 2, 'Máy client Dell Wyse cho doanh nghiệp', '{"cpu":"Intel Celeron","ram":"8GB","storage":"64GB","form":"Thin Client"}', 4.1, 18, 12, FALSE, 'ACTIVE', NOW(), NOW());


  WITH category_seed(category_id, category_label, slug_prefix, product_prefix, brand_ids, warranty_months) AS (
    VALUES
      (1, 'Điện thoại', 'dien-thoai', 'Smartphone', ARRAY[1, 6, 7, 8], 24),
      (2, 'Laptop', 'laptop', 'Laptop', ARRAY[2, 9, 10, 11, 12, 13], 24),
      (3, 'Tai nghe', 'tai-nghe', 'Headset', ARRAY[3, 4, 8, 14, 15], 12),
      (4, 'Chuột', 'chuot', 'Mouse', ARRAY[3, 4, 14, 15], 12),
      (5, 'Bàn phím', 'ban-phim', 'Keyboard', ARRAY[3, 4, 5, 15, 24], 12),
      (6, 'Lót chuột', 'lot-chuot', 'Mousepad', ARRAY[3, 4, 5, 14], 6),
      (7, 'PC Gaming', 'pc-gaming', 'Gaming PC', ARRAY[2, 5, 9, 10, 19, 21], 24),
      (8, 'Máy bộ', 'may-bo', 'Desktop', ARRAY[2, 11, 12, 18], 24),
      (9, 'Linh kiện PC', 'linh-kien-pc', 'PC Part', ARRAY[5, 16, 17, 18, 19, 20, 21, 22], 36),
      (10, 'Ghế gaming', 'ghe-gaming', 'Gaming Chair', ARRAY[4, 14, 23], 12),
      (11, 'Phụ kiện gaming', 'phu-kien-gaming', 'Accessory', ARRAY[3, 4, 5, 14, 15, 22], 12)
  ),
  model_seed(model_no, model_name, slug_suffix, featured) AS (
    VALUES
      (1, 'Pro 01', 'pro-01', TRUE),
      (2, 'Ultra 02', 'ultra-02', TRUE),
      (3, 'Creator 03', 'creator-03', FALSE),
      (4, 'Esports 04', 'esports-04', FALSE),
      (5, 'Studio 05', 'studio-05', FALSE),
      (6, 'Prime 06', 'prime-06', FALSE),
      (7, 'Max 07', 'max-07', FALSE),
      (8, 'Lite 08', 'lite-08', FALSE)
  ),
  expanded AS (
    SELECT
      50 + ROW_NUMBER() OVER (ORDER BY c.category_id, m.model_no) AS id,
      c.category_id,
      c.category_label,
      c.slug_prefix,
      c.product_prefix,
      c.warranty_months,
      c.brand_ids[((m.model_no - 1) % ARRAY_LENGTH(c.brand_ids, 1)) + 1] AS brand_id,
      m.model_no,
      m.model_name,
      m.slug_suffix,
      m.featured
    FROM category_seed c
    CROSS JOIN model_seed m
  )
  INSERT INTO products
  (id, name, slug, category_id, brand_id, description, specs_json, rating_star, rating_count, warranty_months, featured, status, created_at, updated_at)
  SELECT
    e.id,
    b.name || ' ' || e.product_prefix || ' ' || e.model_name,
    LOWER(b.slug || '-' || e.slug_prefix || '-' || e.slug_suffix),
    e.category_id,
    e.brand_id,
    b.name || ' ' || e.product_prefix || ' ' || e.model_name || ' thuộc nhóm ' || e.category_label || ', dùng cho dữ liệu demo catalog, giỏ hàng, checkout và báo cáo.',
    JSONB_BUILD_OBJECT(
      'brand', b.name,
      'category', e.category_label,
      'series', e.model_name,
      'demo', TRUE
    )::json,
    ROUND((4.1 + ((e.model_no % 8) * 0.1))::numeric, 1)::float,
    20 + (e.category_id * 4) + (e.model_no * 9),
    e.warranty_months,
    e.featured,
    'ACTIVE',
    NOW() - ((e.id % 60) * INTERVAL '1 day'),
    NOW()
  FROM expanded e
  JOIN brands b ON b.id = e.brand_id;


  SELECT setval(
    pg_get_serial_sequence('products', 'id'),
    COALESCE((SELECT MAX(id) FROM products), 1),
    true
  )
  WHERE pg_get_serial_sequence('products', 'id') IS NOT NULL;


  INSERT INTO variants
  (id, product_id, name, slug, sku, color, specs_json, price, total_stock, status, created_at, updated_at)
  VALUES
  (1, 1, 'iPhone 15 Pro Max 256GB Titan Tự Nhiên', 'iphone-15-pro-max-256gb-titan-tu-nhien', 'SKU-0001', 'Titan Tự Nhiên', '{"storage":"256GB","screen":"6.7 inch","chip":"A17 Pro"}', 29990000, 50, 'ACTIVE', NOW(), NOW()),
  (2, 2, 'Dell XPS 13 Plus i7 16GB 512GB Bạc', 'dell-xps-13-plus-i7-16gb-512gb-bac', 'SKU-0002', 'Bạc', '{"cpu":"Intel Core i7","ram":"16GB","storage":"512GB SSD"}', 34990000, 20, 'ACTIVE', NOW(), NOW()),
  (3, 3, 'Logitech G733 Lightspeed Đen', 'logitech-g733-lightspeed-den', 'SKU-0003', 'Đen', '{"type":"over-ear","connection":"wireless","battery":"29h"}', 3490000, 60, 'ACTIVE', NOW(), NOW()),
  (4, 4, 'Logitech G Pro X Superlight 2 Trắng', 'logitech-g-pro-x-superlight-2-trang', 'SKU-0004', 'Trắng', '{"dpi":"32000","weight":"60g","connection":"wireless"}', 3290000, 70, 'ACTIVE', NOW(), NOW()),
  (5, 5, 'Razer BlackWidow V4 Green Switch', 'razer-blackwidow-v4-green-switch', 'SKU-0005', 'Đen', '{"switch":"Green Mechanical","layout":"Full-size","rgb":true}', 4290000, 35, 'ACTIVE', NOW(), NOW()),
  (6, 6, 'Razer Gigantus V2 Large Đen', 'razer-gigantus-v2-large-den', 'SKU-0006', 'Đen', '{"size":"Large","surface":"cloth","antiSlip":true}', 590000, 100, 'ACTIVE', NOW(), NOW()),
  (7, 7, 'Alienware Aurora R16 i7 RTX 4070', 'alienware-aurora-r16-i7-rtx-4070', 'SKU-0007', 'Đen', '{"cpu":"Intel Core i7","gpu":"RTX 4070","ram":"32GB","storage":"1TB SSD"}', 38990000, 15, 'ACTIVE', NOW(), NOW()),
  (8, 8, 'Dell OptiPlex 7010 i5 16GB 512GB', 'dell-optiplex-7010-i5-16gb-512gb', 'SKU-0008', 'Đen', '{"cpu":"Intel Core i5","ram":"16GB","storage":"512GB SSD"}', 15990000, 25, 'ACTIVE', NOW(), NOW()),
  (9, 9, 'Corsair Vengeance DDR5 32GB 5600MHz', 'corsair-vengeance-ddr5-32gb-5600mhz', 'SKU-0009', 'Đen', '{"capacity":"32GB","bus":"5600MHz","type":"DDR5"}', 2990000, 80, 'ACTIVE', NOW(), NOW()),
  (10, 10, 'Razer Iskur V2 Gaming Chair Black', 'razer-iskur-v2-gaming-chair-black', 'SKU-0010', 'Đen', '{"material":"synthetic leather","lumbarSupport":true,"color":"black"}', 9990000, 18, 'ACTIVE', NOW(), NOW()),




  (11, 11, 'iPhone 15 128GB Xanh', 'iphone-15-128gb-xanh', 'SKU-0011', 'Xanh', '{"storage":"128GB","screen":"6.1 inch","chip":"A16 Bionic"}', 19990000, 45, 'ACTIVE', NOW(), NOW()),
  (12, 12, 'iPhone 15 Plus 256GB Hồng', 'iphone-15-plus-256gb-hong', 'SKU-0012', 'Hồng', '{"storage":"256GB","screen":"6.7 inch","chip":"A16 Bionic"}', 24990000, 38, 'ACTIVE', NOW(), NOW()),
  (13, 13, 'iPhone 14 Pro 128GB Tím', 'iphone-14-pro-128gb-tim', 'SKU-0013', 'Tím', '{"storage":"128GB","screen":"6.1 inch","chip":"A16 Bionic"}', 22990000, 30, 'ACTIVE', NOW(), NOW()),
  (14, 14, 'iPhone 13 128GB Trắng', 'iphone-13-128gb-trang', 'SKU-0014', 'Trắng', '{"storage":"128GB","screen":"6.1 inch","chip":"A15 Bionic"}', 14990000, 55, 'ACTIVE', NOW(), NOW()),
  (15, 15, 'iPhone SE 2022 64GB Đỏ', 'iphone-se-2022-64gb-do', 'SKU-0015', 'Đỏ', '{"storage":"64GB","screen":"4.7 inch","chip":"A15 Bionic"}', 9990000, 40, 'ACTIVE', NOW(), NOW()),




  (16, 16, 'Dell Inspiron 15 3530 i5 8GB 512GB', 'dell-inspiron-15-3530-i5-8gb-512gb', 'SKU-0016', 'Bạc', '{"cpu":"Intel Core i5","ram":"8GB","storage":"512GB SSD","screen":"15.6 inch"}', 13990000, 28, 'ACTIVE', NOW(), NOW()),
  (17, 17, 'Dell Vostro 3520 i5 8GB 512GB', 'dell-vostro-3520-i5-8gb-512gb', 'SKU-0017', 'Đen', '{"cpu":"Intel Core i5","ram":"8GB","storage":"512GB SSD","screen":"15.6 inch"}', 12990000, 32, 'ACTIVE', NOW(), NOW()),
  (18, 18, 'Dell Latitude 5440 i7 16GB 512GB', 'dell-latitude-5440-i7-16gb-512gb', 'SKU-0018', 'Xám', '{"cpu":"Intel Core i7","ram":"16GB","storage":"512GB SSD","screen":"14 inch"}', 24990000, 22, 'ACTIVE', NOW(), NOW()),
  (19, 19, 'Dell Precision 3581 i7 32GB 1TB', 'dell-precision-3581-i7-32gb-1tb', 'SKU-0019', 'Xám', '{"cpu":"Intel Core i7","ram":"32GB","storage":"1TB SSD","gpu":"NVIDIA RTX"}', 39990000, 12, 'ACTIVE', NOW(), NOW()),
  (20, 20, 'Dell G15 5530 i7 RTX 4060', 'dell-g15-5530-i7-rtx-4060', 'SKU-0020', 'Đen', '{"cpu":"Intel Core i7","ram":"16GB","gpu":"RTX 4060","screen":"15.6 inch 165Hz"}', 28990000, 18, 'ACTIVE', NOW(), NOW()),




  (21, 21, 'Logitech H390 USB Headset Đen', 'logitech-h390-usb-headset-den', 'SKU-0021', 'Đen', '{"connection":"USB","microphone":true,"noiseCanceling":true}', 690000, 75, 'ACTIVE', NOW(), NOW()),
  (22, 22, 'Logitech G435 Lightspeed Trắng', 'logitech-g435-lightspeed-trang', 'SKU-0022', 'Trắng', '{"connection":"wireless","battery":"18h","type":"over-ear"}', 1490000, 64, 'ACTIVE', NOW(), NOW()),
  (23, 23, 'Logitech G Pro X Gaming Headset Đen', 'logitech-g-pro-x-gaming-headset-den', 'SKU-0023', 'Đen', '{"connection":"wired","surround":"7.1","type":"over-ear"}', 2790000, 42, 'ACTIVE', NOW(), NOW()),
  (24, 24, 'Razer BlackShark V2 X Đen', 'razer-blackshark-v2-x-den', 'SKU-0024', 'Đen', '{"connection":"wired","driver":"50mm","type":"over-ear"}', 1390000, 58, 'ACTIVE', NOW(), NOW()),
  (25, 25, 'Razer Barracuda X Wireless Đen', 'razer-barracuda-x-wireless-den', 'SKU-0025', 'Đen', '{"connection":"wireless","battery":"50h","type":"over-ear"}', 2490000, 36, 'ACTIVE', NOW(), NOW()),




  (26, 26, 'Logitech M331 Silent Plus Đen', 'logitech-m331-silent-plus-den', 'SKU-0026', 'Đen', '{"dpi":"1000","connection":"wireless","silent":true}', 390000, 120, 'ACTIVE', NOW(), NOW()),
  (27, 27, 'Logitech MX Master 3S Graphite', 'logitech-mx-master-3s-graphite', 'SKU-0027', 'Graphite', '{"dpi":"8000","connection":"bluetooth","silent":true}', 2290000, 45, 'ACTIVE', NOW(), NOW()),
  (28, 28, 'Logitech G502 X Plus Trắng', 'logitech-g502-x-plus-trang', 'SKU-0028', 'Trắng', '{"dpi":"25600","connection":"wireless","rgb":true}', 3690000, 34, 'ACTIVE', NOW(), NOW()),
  (29, 29, 'Razer DeathAdder V3 Đen', 'razer-deathadder-v3-den', 'SKU-0029', 'Đen', '{"dpi":"30000","weight":"59g","connection":"wired"}', 1890000, 52, 'ACTIVE', NOW(), NOW()),
  (30, 30, 'Razer Basilisk V3 Đen', 'razer-basilisk-v3-den', 'SKU-0030', 'Đen', '{"dpi":"26000","buttons":"11","rgb":true}', 1590000, 48, 'ACTIVE', NOW(), NOW()),




  (31, 31, 'Logitech K380 Bluetooth Keyboard Hồng', 'logitech-k380-bluetooth-keyboard-hong', 'SKU-0031', 'Hồng', '{"layout":"Compact","connection":"Bluetooth","multiDevice":true}', 790000, 86, 'ACTIVE', NOW(), NOW()),
  (32, 32, 'Logitech MX Keys S Graphite', 'logitech-mx-keys-s-graphite', 'SKU-0032', 'Graphite', '{"layout":"Full-size","connection":"Bluetooth","backlight":true}', 2490000, 37, 'ACTIVE', NOW(), NOW()),
  (33, 33, 'Logitech G Pro X TKL Black', 'logitech-g-pro-x-tkl-black', 'SKU-0033', 'Đen', '{"layout":"TKL","switch":"GX Brown","rgb":true}', 3290000, 26, 'ACTIVE', NOW(), NOW()),
  (34, 34, 'Razer Huntsman V2 TKL Black', 'razer-huntsman-v2-tkl-black', 'SKU-0034', 'Đen', '{"layout":"TKL","switch":"Optical","rgb":true}', 2990000, 29, 'ACTIVE', NOW(), NOW()),
  (35, 35, 'Corsair K70 RGB MK.2 Cherry MX Red', 'corsair-k70-rgb-mk2-cherry-mx-red', 'SKU-0035', 'Đen', '{"layout":"Full-size","switch":"Cherry MX Red","rgb":true}', 3490000, 24, 'ACTIVE', NOW(), NOW()),




  (36, 36, 'Logitech Studio Series Desk Mat Lavender', 'logitech-studio-series-desk-mat-lavender', 'SKU-0036', 'Tím', '{"size":"Large","surface":"cloth","waterResistant":true}', 490000, 90, 'ACTIVE', NOW(), NOW()),
  (37, 37, 'Razer Strider Large Black', 'razer-strider-large-black', 'SKU-0037', 'Đen', '{"size":"Large","surface":"hybrid","antiSlip":true}', 890000, 62, 'ACTIVE', NOW(), NOW()),
  (38, 38, 'Corsair MM300 Pro Extended Black', 'corsair-mm300-pro-extended-black', 'SKU-0038', 'Đen', '{"size":"Extended","surface":"cloth","spillProof":true}', 690000, 70, 'ACTIVE', NOW(), NOW()),
  (39, 39, 'Razer Firefly V2 RGB Black', 'razer-firefly-v2-rgb-black', 'SKU-0039', 'Đen', '{"size":"Medium","surface":"hard","rgb":true}', 1490000, 33, 'ACTIVE', NOW(), NOW()),
  (40, 40, 'Logitech G PowerPlay Wireless Charging', 'logitech-g-powerplay-wireless-charging', 'SKU-0040', 'Đen', '{"size":"Medium","wirelessCharging":true,"compatible":"Logitech G"}', 2890000, 20, 'ACTIVE', NOW(), NOW()),




  (41, 41, 'Alienware Aurora R15 i7 RTX 4070 Ti', 'alienware-aurora-r15-i7-rtx-4070-ti', 'SKU-0041', 'Đen', '{"cpu":"Intel Core i7","gpu":"RTX 4070 Ti","ram":"32GB","storage":"1TB SSD"}', 45990000, 10, 'ACTIVE', NOW(), NOW()),
  (42, 42, 'Dell G5 Gaming Desktop i5 RTX 3060', 'dell-g5-gaming-desktop-i5-rtx-3060', 'SKU-0042', 'Đen', '{"cpu":"Intel Core i5","gpu":"RTX 3060","ram":"16GB","storage":"512GB SSD"}', 24990000, 14, 'ACTIVE', NOW(), NOW()),
  (43, 43, 'Corsair Vengeance i7400 i7 RTX 4080', 'corsair-vengeance-i7400-i7-rtx-4080', 'SKU-0043', 'Đen', '{"cpu":"Intel Core i7","gpu":"RTX 4080","ram":"32GB","storage":"2TB SSD"}', 59990000, 8, 'ACTIVE', NOW(), NOW()),
  (44, 44, 'Corsair One i500 i9 RTX 4090', 'corsair-one-i500-i9-rtx-4090', 'SKU-0044', 'Đen', '{"cpu":"Intel Core i9","gpu":"RTX 4090","ram":"64GB","storage":"2TB SSD"}', 89990000, 5, 'ACTIVE', NOW(), NOW()),
  (45, 45, 'Razer Tomahawk Gaming Desktop i7 RTX 4070', 'razer-tomahawk-gaming-desktop-i7-rtx-4070', 'SKU-0045', 'Đen', '{"cpu":"Intel Core i7","gpu":"RTX 4070","ram":"32GB","storage":"1TB SSD"}', 49990000, 9, 'ACTIVE', NOW(), NOW()),




  (46, 46, 'Dell OptiPlex 3000 Micro i3 8GB 256GB', 'dell-optiplex-3000-micro-i3-8gb-256gb', 'SKU-0046', 'Đen', '{"cpu":"Intel Core i3","ram":"8GB","storage":"256GB SSD","form":"Micro"}', 8990000, 35, 'ACTIVE', NOW(), NOW()),
  (47, 47, 'Dell OptiPlex 5000 SFF i5 16GB 512GB', 'dell-optiplex-5000-sff-i5-16gb-512gb', 'SKU-0047', 'Đen', '{"cpu":"Intel Core i5","ram":"16GB","storage":"512GB SSD","form":"SFF"}', 13990000, 27, 'ACTIVE', NOW(), NOW()),
  (48, 48, 'Dell OptiPlex 7000 Tower i7 16GB 1TB', 'dell-optiplex-7000-tower-i7-16gb-1tb', 'SKU-0048', 'Đen', '{"cpu":"Intel Core i7","ram":"16GB","storage":"1TB SSD","form":"Tower"}', 19990000, 18, 'ACTIVE', NOW(), NOW()),
  (49, 49, 'Dell Precision 3660 Tower i7 32GB 1TB RTX', 'dell-precision-3660-tower-i7-32gb-1tb-rtx', 'SKU-0049', 'Đen', '{"cpu":"Intel Core i7","ram":"32GB","storage":"1TB SSD","gpu":"NVIDIA RTX"}', 36990000, 12, 'ACTIVE', NOW(), NOW()),
  (50, 50, 'Dell Wyse 5070 Thin Client 8GB 64GB', 'dell-wyse-5070-thin-client-8gb-64gb', 'SKU-0050', 'Đen', '{"cpu":"Intel Celeron","ram":"8GB","storage":"64GB","form":"Thin Client"}', 5990000, 30, 'ACTIVE', NOW(), NOW());


  WITH generated_products AS (
    SELECT
      p.*,
      ROW_NUMBER() OVER (ORDER BY p.id) AS row_no
    FROM products p
    WHERE p.id > 50
  )
  INSERT INTO variants
  (id, product_id, name, slug, sku, color, specs_json, price, total_stock, status, created_at, updated_at)
  SELECT
    50 + row_no,
    id,
    name || ' - Bản tiêu chuẩn',
    slug || '-standard',
    'SKU-' || LPAD((50 + row_no)::text, 4, '0'),
    (ARRAY['Đen', 'Trắng', 'Xám', 'Xanh', 'Đỏ', 'Graphite'])[((row_no - 1) % 6) + 1],
    JSONB_BUILD_OBJECT(
      'option', 'standard',
      'color', (ARRAY['Đen', 'Trắng', 'Xám', 'Xanh', 'Đỏ', 'Graphite'])[((row_no - 1) % 6) + 1],
      'stockProfile', 'demo-seed'
    )::json,
    CASE category_id
      WHEN 1 THEN 7990000 + ((row_no % 8) * 2500000)
      WHEN 2 THEN 12990000 + ((row_no % 8) * 3200000)
      WHEN 3 THEN 690000 + ((row_no % 8) * 450000)
      WHEN 4 THEN 390000 + ((row_no % 8) * 380000)
      WHEN 5 THEN 790000 + ((row_no % 8) * 520000)
      WHEN 6 THEN 190000 + ((row_no % 8) * 160000)
      WHEN 7 THEN 22990000 + ((row_no % 8) * 5200000)
      WHEN 8 THEN 6990000 + ((row_no % 8) * 2100000)
      WHEN 9 THEN 490000 + ((row_no % 8) * 1900000)
      WHEN 10 THEN 2990000 + ((row_no % 8) * 900000)
      ELSE 290000 + ((row_no % 8) * 350000)
    END,
    CASE category_id
      WHEN 7 THEN 5 + (row_no % 9)
      WHEN 10 THEN 8 + (row_no % 12)
      WHEN 1 THEN 24 + (row_no % 36)
      WHEN 2 THEN 14 + (row_no % 24)
      ELSE 35 + (row_no % 80)
    END,
    'ACTIVE',
    created_at,
    updated_at
  FROM generated_products;




  INSERT INTO media (id, product_id, variant_id, public_id, image_url, is_primary, display_order, created_at, updated_at)
  SELECT
    ROW_NUMBER() OVER (ORDER BY p.id, v.id),
    p.id,
    v.id,
    'products/' || p.slug || '-main',
    'https://picsum.photos/seed/' || p.slug || '/900/900',
    TRUE,
    1,
    p.created_at,
    p.updated_at
  FROM products p
  JOIN variants v ON v.product_id = p.id;


  INSERT INTO carts (id, user_id, created_at, updated_at)
  SELECT
    cart_no,
    cart_no,
    NOW() - (cart_no * INTERVAL '2 hours'),
    NOW()
  FROM generate_series(1, 10) AS cart_no;


  INSERT INTO cart_items (id, cart_id, variant_id, quantity, created_at, updated_at)
  SELECT
    ROW_NUMBER() OVER (ORDER BY c.id, item_no),
    c.id,
    ((c.id * 7 + item_no * 3) % (SELECT MAX(id) FROM variants)) + 1,
    CASE WHEN item_no = 1 THEN 1 ELSE 2 END,
    c.created_at,
    c.updated_at
  FROM carts c
  CROSS JOIN generate_series(1, 3) AS item_no
  WHERE c.id <= 10;




  -- =====================
  -- SALES
  -- =====================




  INSERT INTO coupons (id, category_id, brand_id, code, type, value, min_order, start_date, end_date, usage_limit, max_discount, status, created_at, updated_at) VALUES
  (1, NULL, NULL, 'WELCOME10', 'PERCENT', 10, 1000000, NOW(), NOW() + INTERVAL '30 days', 100, 500000, 'ACTIVE', NOW(), NOW()),
  (2, 7, NULL, 'PCGAMING1M', 'FIXED', 1000000, 30000000, NOW(), NOW() + INTERVAL '45 days', 50, 1000000, 'ACTIVE', NOW(), NOW()),
  (3, 2, NULL, 'LAPTOP7', 'PERCENT', 7, 15000000, NOW(), NOW() + INTERVAL '60 days', 70, 1000000, 'ACTIVE', NOW(), NOW()),
  (4, NULL, 4, 'RAZER5', 'PERCENT', 5, 1000000, NOW(), NOW() + INTERVAL '30 days', 80, 700000, 'ACTIVE', NOW(), NOW()),
  (5, 4, 3, 'LOGI300K', 'FIXED', 300000, 3000000, NOW(), NOW() + INTERVAL '20 days', 40, 300000, 'ACTIVE', NOW(), NOW());




  INSERT INTO orders (id, user_id, coupon_id, code, shipping_name, shipping_phone, shipping_line, shipping_ward, shipping_district, shipping_province, tracking_code, status, payment_method, payment_status, discount, shipping_fee, subtotal, total, note, shipping_provider, shipping_status, paid_at, created_at, updated_at) VALUES
  (1, 1, 1, 'ORD-0001', 'Nguyễn Văn An', '0911111111', '12 Nguyễn Trãi', 'Phường Bến Thành', 'Quận 1', 'Hồ Chí Minh', 'TRK-0001', 'COMPLETED', 'CASH', 'PAID', 500000, 30000, 29990000, 29520000, 'Giao nhanh giúp khách', 'GHN', 'DELIVERED', NOW(), NOW(), NOW()),
  (2, 2, 3, 'ORD-0002', 'Trần Thị Bình', '0911111112', '45 Lê Lợi', 'Phường Bến Nghé', 'Quận 1', 'Hồ Chí Minh', 'TRK-0002', 'PROCESSING', 'DIGITAL', 'PAID', 1000000, 30000, 34990000, 34020000, NULL, 'GHTK', 'SHIPPING', NOW(), NOW(), NOW()),
  (3, 3, 5, 'ORD-0003', 'Lê Minh Châu', '0911111113', '78 Trần Phú', 'Phường 4', 'Quận 5', 'Hồ Chí Minh', 'TRK-0003', 'PENDING', 'CASH', 'PENDING', 300000, 30000, 3290000, 3020000, NULL, 'VIETTELPOST', 'PENDING', NULL, NOW(), NOW()),
  (4, 4, NULL, 'ORD-0004', 'Phạm Quốc Dũng', '0911111114', '99 Cầu Giấy', 'Dịch Vọng', 'Cầu Giấy', 'Hà Nội', 'TRK-0004', 'COMPLETED', 'DIGITAL', 'PAID', 0, 40000, 4290000, 4330000, NULL, 'VNPOST', 'DELIVERED', NOW(), NOW(), NOW()),
  (5, 5, 4, 'ORD-0005', 'Hoàng Kim Em', '0911111115', '101 Hải Phòng', 'Thạch Thang', 'Hải Châu', 'Đà Nẵng', 'TRK-0005', 'RETURNED', 'CASH', 'REFUNDED', 300000, 30000, 3490000, 3220000, 'Khách yêu cầu đổi trả', 'OTHER', 'RETURNED', NOW(), NOW(), NOW());


  WITH order_base AS (
    SELECT
      order_no,
      ((order_no - 1) % 23) + 1 AS user_id,
      ((order_no - 1) % (SELECT MAX(id) FROM variants)) + 1 AS variant_id,
      1 + (order_no % 2) AS quantity,
      CASE order_no % 10
        WHEN 0 THEN 'CANCELLED'
        WHEN 1 THEN 'PENDING'
        WHEN 2 THEN 'PROCESSING'
        WHEN 3 THEN 'COMPLETED'
        WHEN 4 THEN 'COMPLETED'
        WHEN 5 THEN 'RETURNED'
        WHEN 6 THEN 'REFUNDED'
        WHEN 7 THEN 'PROCESSING'
        ELSE 'COMPLETED'
      END AS order_status,
      CASE WHEN order_no % 3 = 0 THEN 'CASH' ELSE 'DIGITAL' END AS payment_method,
      CASE WHEN order_no % 7 = 0 THEN ((order_no % 5) + 1) ELSE NULL END AS coupon_id,
      NOW() - (order_no * INTERVAL '1 day') AS created_value
    FROM generate_series(6, 55) AS order_no
  ),
  order_seed AS (
    SELECT
      ob.*,
      v.price,
      v.price * ob.quantity AS subtotal_value,
      CASE WHEN v.price >= 10000000 THEN 0 ELSE 30000 END AS shipping_fee_value,
      CASE WHEN ob.coupon_id IS NULL THEN 0 ELSE LEAST(v.price * ob.quantity * 0.05, 500000) END AS discount_value
    FROM order_base ob
    JOIN variants v ON v.id = ob.variant_id
  )
  INSERT INTO orders
  (id, user_id, coupon_id, code, shipping_name, shipping_phone, shipping_line, shipping_ward, shipping_district, shipping_province, tracking_code, status, payment_method, payment_status, discount, shipping_fee, subtotal, total, note, shipping_provider, shipping_status, paid_at, created_at, updated_at)
  SELECT
    order_no,
    user_id,
    coupon_id,
    'ORD-DEMO-' || LPAD(order_no::text, 4, '0'),
    'Khách hàng Demo ' || LPAD(user_id::text, 2, '0'),
    '093' || LPAD(order_no::text, 7, '0'),
    'Số ' || order_no || ' Đường Demo',
    'Phường ' || ((order_no % 12) + 1),
    CASE order_no % 4 WHEN 0 THEN 'Quận 1' WHEN 1 THEN 'Cầu Giấy' WHEN 2 THEN 'Hải Châu' ELSE 'Tân Bình' END,
    CASE order_no % 4 WHEN 0 THEN 'Hồ Chí Minh' WHEN 1 THEN 'Hà Nội' WHEN 2 THEN 'Đà Nẵng' ELSE 'Hồ Chí Minh' END,
    'TRK-D-' || LPAD(order_no::text, 4, '0'),
    order_status,
    payment_method,
    CASE
      WHEN order_status IN ('COMPLETED') THEN 'PAID'
      WHEN order_status IN ('RETURNED', 'REFUNDED') THEN 'REFUNDED'
      WHEN order_status = 'CANCELLED' THEN 'CANCELLED'
      ELSE 'PENDING'
    END,
    discount_value,
    shipping_fee_value,
    subtotal_value,
    subtotal_value - discount_value + shipping_fee_value,
    CASE WHEN order_no % 9 = 0 THEN 'Đơn demo dùng để kiểm thử báo cáo.' ELSE NULL END,
    CASE order_no % 5 WHEN 0 THEN 'GHN' WHEN 1 THEN 'GHTK' WHEN 2 THEN 'VIETTELPOST' WHEN 3 THEN 'VNPOST' ELSE 'OTHER' END,
    CASE
      WHEN order_status = 'COMPLETED' THEN 'DELIVERED'
      WHEN order_status IN ('RETURNED', 'REFUNDED') THEN 'RETURNED'
      WHEN order_status = 'CANCELLED' THEN 'CANCELLED'
      WHEN order_status = 'PROCESSING' THEN 'SHIPPING'
      ELSE 'PENDING'
    END,
    CASE WHEN order_status IN ('COMPLETED', 'RETURNED', 'REFUNDED') THEN created_value + INTERVAL '2 hours' ELSE NULL END,
    created_value,
    created_value + INTERVAL '3 hours'
  FROM order_seed;




  INSERT INTO order_details (order_id, variant_id, price, quantity) VALUES
  (1, 1, 29990000, 1),
  (2, 2, 34990000, 1),
  (3, 4, 3290000, 1),
  (4, 5, 4290000, 1),
  (5, 3, 3490000, 1);

  INSERT INTO order_details (order_id, variant_id, price, quantity)
  SELECT
    o.id,
    ((o.id - 1) % (SELECT MAX(id) FROM variants)) + 1,
    v.price,
    1 + (o.id % 2)
  FROM orders o
  JOIN variants v ON v.id = ((o.id - 1) % (SELECT MAX(id) FROM variants)) + 1
  WHERE o.id >= 6;




  INSERT INTO reviews (id, product_id, user_id, order_id, rating_star, content, photos_json, created_at, updated_at) VALUES
  (1, 1, 1, 1, 5, 'Điện thoại đẹp, hiệu năng rất tốt.', '["https://example.com/reviews/r1.jpg"]', NOW(), NOW()),
  (2, 2, 2, 2, 4, 'Laptop mỏng nhẹ, màn hình đẹp.', '[]', NOW(), NOW()),
  (3, 4, 3, 3, 5, 'Chuột nhẹ, phản hồi nhanh, hợp chơi FPS.', '[]', NOW(), NOW()),
  (4, 5, 4, 4, 4, 'Bàn phím gõ tốt, RGB đẹp.', '[]', NOW(), NOW()),
  (5, 3, 5, 5, 3, 'Tai nghe ổn nhưng khách muốn đổi sản phẩm.', '["https://example.com/reviews/r5.jpg"]', NOW(), NOW());

  INSERT INTO reviews (id, product_id, user_id, order_id, rating_star, content, photos_json, created_at, updated_at)
  SELECT
    5 + ROW_NUMBER() OVER (ORDER BY o.id),
    v.product_id,
    o.user_id,
    o.id,
    CASE WHEN o.id % 5 = 0 THEN 4 ELSE 5 END,
    CASE
      WHEN o.id % 5 = 0 THEN 'Sản phẩm đúng mô tả, đóng gói chắc chắn.'
      WHEN o.id % 3 = 0 THEN 'Hiệu năng tốt, giao nhanh hơn dự kiến.'
      ELSE 'Trải nghiệm mua hàng ổn, sẽ quay lại khi cần nâng cấp setup.'
    END,
    '[]',
    o.created_at + INTERVAL '3 days',
    o.created_at + INTERVAL '3 days'
  FROM orders o
  JOIN order_details od ON od.order_id = o.id
  JOIN variants v ON v.id = od.variant_id
  WHERE o.id >= 6
    AND o.status = 'COMPLETED';




  INSERT INTO return_requests (id, user_id, order_id, variant_id, quantity, handled_by_staff_id, type, reason, refund_amount, refund_method, evidence_json, status, created_at, updated_at, resolved_at) VALUES
  (1, 5, 5, 3, 1, 5, 'RETURN', 'Sản phẩm không phù hợp nhu cầu', 3220000, 'DIGITAL', '["https://example.com/evidence/return-1.jpg"]', 'COMPLETED', NOW(), NOW(), NOW()),
  (2, 1, 1, 1, 1, 5, 'WARRANTY', 'Kiểm tra pin', 0, 'CASH', '[]', 'PENDING', NOW(), NOW(), NULL),
  (3, 2, 2, 2, 1, 5, 'EXCHANGE', 'Muốn đổi cấu hình khác', 0, 'DIGITAL', '[]', 'APPROVED', NOW(), NOW(), NULL),
  (4, 3, 3, 4, 1, 5, 'WARRANTY', 'Chuột double click', 0, 'CASH', '[]', 'PENDING', NOW(), NOW(), NULL),
  (5, 4, 4, 5, 1, 5, 'RETURN', 'Đặt nhầm sản phẩm', 4330000, 'DIGITAL', '[]', 'REJECTED', NOW(), NOW(), NOW());

  INSERT INTO return_requests (id, user_id, order_id, variant_id, quantity, handled_by_staff_id, type, reason, refund_amount, refund_method, evidence_json, status, created_at, updated_at, resolved_at)
  SELECT
    5 + ROW_NUMBER() OVER (ORDER BY o.id),
    o.user_id,
    o.id,
    od.variant_id,
    od.quantity,
    5,
    CASE WHEN o.id % 2 = 0 THEN 'RETURN' ELSE 'EXCHANGE' END,
    CASE WHEN o.id % 2 = 0 THEN 'Khách đổi ý sau khi nhận hàng' ELSE 'Muốn đổi sang phiên bản khác' END,
    CASE WHEN o.status = 'REFUNDED' THEN o.total ELSE 0 END,
    o.payment_method,
    '[]',
    CASE WHEN o.status = 'REFUNDED' THEN 'COMPLETED' ELSE 'APPROVED' END,
    o.created_at + INTERVAL '4 days',
    o.updated_at + INTERVAL '4 days',
    CASE WHEN o.status = 'REFUNDED' THEN o.updated_at + INTERVAL '5 days' ELSE NULL END
  FROM orders o
  JOIN order_details od ON od.order_id = o.id
  WHERE o.id >= 6
    AND o.status IN ('RETURNED', 'REFUNDED')
  LIMIT 12;




  -- =====================
  -- PAYMENTS
  -- =====================




  INSERT INTO payment_transactions (id, order_id, return_request_id, type, provider, provider_payment_id, amount, note, status, payment_time, payload_json, created_at) VALUES
  (1, 1, NULL, 'PAYMENT', 'COD', 'COD-ORD-0001', 29520000, 'Thanh toán khi nhận hàng', 'SUCCESS', NOW(), '{"method":"CASH"}', NOW()),
  (2, 2, NULL, 'PAYMENT', 'VNPAY', 'VNPAY-ORD-0002', 34020000, 'Thanh toán điện tử qua VNPAY', 'SUCCESS', NOW(), '{"method":"DIGITAL","bank":"NCB"}', NOW()),
  (3, 3, NULL, 'PAYMENT', 'COD', 'COD-ORD-0003', 3020000, 'Chờ thanh toán tiền mặt', 'PENDING', NULL, '{"method":"CASH"}', NOW()),
  (4, 4, NULL, 'PAYMENT', 'MOMO', 'MOMO-ORD-0004', 4330000, 'Thanh toán điện tử qua MOMO', 'SUCCESS', NOW(), '{"method":"DIGITAL","wallet":"MOMO"}', NOW()),
  (5, 5, 1, 'REFUND', 'VNPAY', 'REFUND-ORD-0005', 3220000, 'Hoàn tiền điện tử cho đơn trả hàng', 'REFUNDED', NOW(), '{"method":"DIGITAL"}', NOW());

  INSERT INTO payment_transactions (id, order_id, return_request_id, type, provider, provider_payment_id, amount, note, status, payment_time, payload_json, created_at)
  SELECT
    5 + ROW_NUMBER() OVER (ORDER BY o.id),
    o.id,
    NULL,
    'PAYMENT',
    CASE
      WHEN o.payment_method = 'CASH' THEN 'COD'
      WHEN o.id % 2 = 0 THEN 'VNPAY'
      ELSE 'MOMO'
    END,
    'PAY-DEMO-' || LPAD(o.id::text, 4, '0'),
    o.total,
    'Giao dịch demo cho ' || o.code,
    CASE o.payment_status
      WHEN 'PAID' THEN 'SUCCESS'
      WHEN 'REFUNDED' THEN 'REFUNDED'
      WHEN 'CANCELLED' THEN 'CANCELLED'
      WHEN 'FAILED' THEN 'FAILED'
      ELSE 'PENDING'
    END,
    CASE WHEN o.payment_status IN ('PAID', 'REFUNDED') THEN o.paid_at ELSE NULL END,
    JSONB_BUILD_OBJECT('seed', TRUE, 'orderCode', o.code, 'method', o.payment_method)::json,
    o.created_at
  FROM orders o
  WHERE o.id >= 6;




  -- =====================
  -- WAREHOUSE
  -- =====================




  INSERT INTO warehouses (id, name, line, ward, district, province, capacity, current_stock, status, created_at, updated_at) VALUES
  (1, 'Kho Hồ Chí Minh', 'KCN Tân Bình', 'Tây Thạnh', 'Tân Phú', 'Hồ Chí Minh', 10000, 245, 'ACTIVE', NOW(), NOW()),
  (2, 'Kho Hà Nội', 'KCN Thăng Long', 'Đông Anh', 'Đông Anh', 'Hà Nội', 8000, 120, 'ACTIVE', NOW(), NOW()),
  (3, 'Kho Đà Nẵng', 'KCN Hòa Khánh', 'Hòa Khánh Bắc', 'Liên Chiểu', 'Đà Nẵng', 6000, 85, 'ACTIVE', NOW(), NOW()),
  (4, 'Kho Cần Thơ', 'KCN Trà Nóc', 'Trà Nóc', 'Bình Thủy', 'Cần Thơ', 5000, 60, 'ACTIVE', NOW(), NOW()),
  (5, 'Kho Bình Dương', 'KCN VSIP', 'Bình Hòa', 'Thuận An', 'Bình Dương', 7000, 95, 'ACTIVE', NOW(), NOW());




  INSERT INTO warehouse_details (warehouse_id, variant_id, quantity)
  SELECT
    ((id - 1) % 5) + 1,
    id,
    total_stock
  FROM variants;

  UPDATE warehouses w
  SET current_stock = COALESCE((
    SELECT SUM(wd.quantity)
    FROM warehouse_details wd
    WHERE wd.warehouse_id = w.id
  ), 0)::integer;




  INSERT INTO warehouse_transactions (id, code, warehouse_id, staff_id, order_id, return_request_id, type, status, note, created_at, updated_at) VALUES
  (1, 'WT-0001', 1, 3, NULL, NULL, 'IMPORT', 'COMPLETED', 'Nhập iPhone và gear gaming', NOW(), NOW()),
  (2, 'WT-0002', 1, 3, 1, NULL, 'EXPORT', 'COMPLETED', 'Xuất hàng đơn ORD-0001', NOW(), NOW()),
  (3, 'WT-0003', 2, 3, NULL, NULL, 'IMPORT', 'COMPLETED', 'Nhập laptop Dell XPS', NOW(), NOW()),
  (4, 'WT-0004', 3, 3, NULL, NULL, 'INTERNAL_TRANSFER', 'PENDING', 'Chuyển gear gaming nội bộ', NOW(), NOW()),
  (5, 'WT-0005', 1, 3, 5, 1, 'RETURN', 'COMPLETED', 'Nhập lại tai nghe hoàn trả', NOW(), NOW());




  INSERT INTO warehouse_transaction_details (warehouse_transaction_id, variant_id, quantity) VALUES
  (1, 1, 50),
  (2, 1, 1),
  (3, 2, 20),
  (4, 5, 5),
  (5, 3, 1);




  -- =====================
  -- SECURITY
  -- =====================




  INSERT INTO invalidated_tokens (id, expiry_time, created_at) VALUES
  ('token-demo-001', NOW() + INTERVAL '1 day', NOW()),
  ('token-demo-002', NOW() + INTERVAL '2 days', NOW()),
  ('token-demo-003', NOW() + INTERVAL '3 days', NOW()),
  ('token-demo-004', NOW() + INTERVAL '4 days', NOW()),
  ('token-demo-005', NOW() + INTERVAL '5 days', NOW());




  -- =====================
  -- RESET SEQUENCES AFTER EXPLICIT IDS
  -- =====================
  SELECT setval(pg_get_serial_sequence('roles', 'id'), COALESCE((SELECT MAX(id) FROM roles), 1));
  SELECT setval(pg_get_serial_sequence('permissions', 'id'), COALESCE((SELECT MAX(id) FROM permissions), 1));
  SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE((SELECT MAX(id) FROM users), 1));
  SELECT setval(pg_get_serial_sequence('staffs', 'id'), COALESCE((SELECT MAX(id) FROM staffs), 1));
  SELECT setval(pg_get_serial_sequence('addresses', 'id'), COALESCE((SELECT MAX(id) FROM addresses), 1));
  SELECT setval(pg_get_serial_sequence('categories', 'id'), COALESCE((SELECT MAX(id) FROM categories), 1));
  SELECT setval(pg_get_serial_sequence('brands', 'id'), COALESCE((SELECT MAX(id) FROM brands), 1));
  SELECT setval(pg_get_serial_sequence('products', 'id'), COALESCE((SELECT MAX(id) FROM products), 1));
  SELECT setval(pg_get_serial_sequence('variants', 'id'), COALESCE((SELECT MAX(id) FROM variants), 1));
  SELECT setval(pg_get_serial_sequence('media', 'id'), COALESCE((SELECT MAX(id) FROM media), 1));
  SELECT setval(pg_get_serial_sequence('carts', 'id'), COALESCE((SELECT MAX(id) FROM carts), 1));
  SELECT setval(pg_get_serial_sequence('cart_items', 'id'), COALESCE((SELECT MAX(id) FROM cart_items), 1));
  SELECT setval(pg_get_serial_sequence('coupons', 'id'), COALESCE((SELECT MAX(id) FROM coupons), 1));
  SELECT setval(pg_get_serial_sequence('orders', 'id'), COALESCE((SELECT MAX(id) FROM orders), 1));
  SELECT setval(pg_get_serial_sequence('reviews', 'id'), COALESCE((SELECT MAX(id) FROM reviews), 1));
  SELECT setval(pg_get_serial_sequence('return_requests', 'id'), COALESCE((SELECT MAX(id) FROM return_requests), 1));
  SELECT setval(pg_get_serial_sequence('payment_transactions', 'id'), COALESCE((SELECT MAX(id) FROM payment_transactions), 1));
  SELECT setval(pg_get_serial_sequence('warehouses', 'id'), COALESCE((SELECT MAX(id) FROM warehouses), 1));
  SELECT setval(pg_get_serial_sequence('warehouse_transactions', 'id'), COALESCE((SELECT MAX(id) FROM warehouse_transactions), 1));


  COMMIT;
