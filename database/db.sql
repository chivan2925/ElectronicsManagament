CREATE TABLE `Product` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `category_id` int,
  `brand_id` int,
  `description` text,
  `rating_star` float,
  `rating_count` int,
  `status` varchar(255),
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `Variant` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `product_id` int,
  `name` varchar(255),
  `color` varchar(255),
  `price` decimal,
  `stock` int,
  `status` varchar(255),
  `created_at` timestamp
);

CREATE TABLE `User` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `avatar` varchar(255),
  `address` varchar(255),
  `email` varchar(255),
  `phone_number` varchar(255),
  `hashed_password` varchar(255),
  `status` varchar(255),
  `created_at` timestamp
);

CREATE TABLE `Staff` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `avatar` varchar(255),
  `email` varchar(255),
  `phone_number` varchar(255),
  `address` varchar(255),
  `role_id` int,
  `assgined_at` timestamp
);

CREATE TABLE `Role` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `created_at` timestamp
);

CREATE TABLE `Permission` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `description` text,
  `created_at` timestamp
);

CREATE TABLE `Category` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `created_at` timestamp
);

CREATE TABLE `Brand` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `image` varchar(255),
  `status` varchar(255),
  `created_at` timestamp
);

CREATE TABLE `Coupon` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `code` varchar(255),
  `type` varchar(255),
  `value` decimal,
  `min_order` decimal,
  `starts_at` timestamp,
  `end_at` timestamp,
  `usage_limit` int,
  `status` varchar(255),
  `category_id` int,
  `brand_id` int
);

CREATE TABLE `Cart` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `updated_at` timestamp,
  `user_id` int
);

CREATE TABLE `Order` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int,
  `code` varchar(255),
  `address` varchar(255),
  `status` varchar(255),
  `payment_method` varchar(255),
  `payment_status` varchar(255),
  `discount` decimal,
  `shipping_fee` decimal,
  `subtotal` decimal,
  `total` decimal,
  `created_at` timestamp,
  `paid_at` timestamp,
  `note` text,
  `shipping_provider` varchar(255),
  `shipping_status` varchar(255)
);

CREATE TABLE `PaymentTransaction` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `order_id` int,
  `provider` varchar(255),
  `provider_payment_id` varchar(255),
  `amount` decimal,
  `status` varchar(255),
  `created_at` timestamp
);

CREATE TABLE `Review` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `product_id` int,
  `user_id` int,
  `star` int,
  `content` text,
  `status` varchar(255),
  `created_at` timestamp
);

CREATE TABLE `Warehouse` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `location` varchar(255),
  `capacity` int,
  `created_at` timestamp
);

CREATE TABLE `OrderDetail` (
  `order_id` int,
  `variant_id` int,
  `quantity` int
);

CREATE TABLE `CartDetail` (
  `cart_id` int,
  `variant_id` int,
  `quantity` int
);

CREATE TABLE `WarehouseDetail` (
  `warehouse_id` int,
  `variant_id` int,
  `quantity` int
);

CREATE TABLE `WarehouseTransaction` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `warehouse_id` int,
  `variant_id` int,
  `staff_id` int,
  `type` varchar(255),
  `quantity` int,
  `date` timestamp,
  `created_at` timestamp
);

CREATE TABLE `RolePermission` (
  `role_id` int,
  `permission_id` int,
  `granted_at` timestamp
);

ALTER TABLE `Product` ADD FOREIGN KEY (`category_id`) REFERENCES `Category` (`id`);

ALTER TABLE `Product` ADD FOREIGN KEY (`brand_id`) REFERENCES `Brand` (`id`);

ALTER TABLE `Variant` ADD FOREIGN KEY (`product_id`) REFERENCES `Product` (`id`);

ALTER TABLE `Staff` ADD FOREIGN KEY (`role_id`) REFERENCES `Role` (`id`);

ALTER TABLE `Coupon` ADD FOREIGN KEY (`category_id`) REFERENCES `Category` (`id`);

ALTER TABLE `Coupon` ADD FOREIGN KEY (`brand_id`) REFERENCES `Brand` (`id`);

ALTER TABLE `Cart` ADD FOREIGN KEY (`user_id`) REFERENCES `User` (`id`);

ALTER TABLE `Order` ADD FOREIGN KEY (`user_id`) REFERENCES `User` (`id`);

ALTER TABLE `PaymentTransaction` ADD FOREIGN KEY (`order_id`) REFERENCES `Order` (`id`);

ALTER TABLE `Review` ADD FOREIGN KEY (`product_id`) REFERENCES `Product` (`id`);

ALTER TABLE `Review` ADD FOREIGN KEY (`user_id`) REFERENCES `User` (`id`);

ALTER TABLE `OrderDetail` ADD FOREIGN KEY (`order_id`) REFERENCES `Order` (`id`);

ALTER TABLE `OrderDetail` ADD FOREIGN KEY (`variant_id`) REFERENCES `Variant` (`id`);

ALTER TABLE `CartDetail` ADD FOREIGN KEY (`cart_id`) REFERENCES `Cart` (`id`);

ALTER TABLE `CartDetail` ADD FOREIGN KEY (`variant_id`) REFERENCES `Variant` (`id`);

ALTER TABLE `WarehouseDetail` ADD FOREIGN KEY (`warehouse_id`) REFERENCES `Warehouse` (`id`);

ALTER TABLE `WarehouseDetail` ADD FOREIGN KEY (`variant_id`) REFERENCES `Variant` (`id`);

ALTER TABLE `WarehouseTransaction` ADD FOREIGN KEY (`warehouse_id`) REFERENCES `Warehouse` (`id`);

ALTER TABLE `WarehouseTransaction` ADD FOREIGN KEY (`variant_id`) REFERENCES `Variant` (`id`);

ALTER TABLE `WarehouseTransaction` ADD FOREIGN KEY (`staff_id`) REFERENCES `Staff` (`id`);

ALTER TABLE `RolePermission` ADD FOREIGN KEY (`role_id`) REFERENCES `Role` (`id`);

ALTER TABLE `RolePermission` ADD FOREIGN KEY (`permission_id`) REFERENCES `Permission` (`id`);
