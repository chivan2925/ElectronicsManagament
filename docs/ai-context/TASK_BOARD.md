# TASK_BOARD

## Dang Lam

- On dinh docs/context cho AI va workflow lam viec.
- Giu rieng client homepage va admin dashboard.

## Da Xong

- Admin dashboard mock tai `/admin`.
- Admin CRUD mock routes:
  - categories
  - brands
  - products
  - variants
  - media
  - users
  - staff
  - roles
  - orders
  - warehouse
  - coupons
- Client homepage dark ecommerce tai `/`.
- Mock categories theo shop gaming/electronics.
- Axios client chuan bi JWT.

## Viec Gan Nen Lam

1. Chuan hoa cau truc client:
   - co the chuyen component client vao `src/components/client/`.
   - co the chuyen page client vao `src/pages/client/`.
2. Tao admin login page.
3. Noi API admin categories.
4. Noi API admin brands.
5. Noi API admin products.
6. Tao public/client product list va product detail mock.
7. Tao cart/checkout mock.

## Viec Backend Can Chu Y

- Cloudinary dependency/config can kiem tra khi chay context test.
- Payment config utility dang co key path khac voi `application.yml`.
- Chua co day du public API cho client e-commerce.
- Can dua secret sang env truoc khi deploy/commit that nghiem tuc.

## Ghi Chu

- Moi khi them feature lon, cap nhat file nay.
- Moi khi them rule moi, tao file rieng trong `docs/ai-context/` va them tom tat vao `AGENTS.md` neu rule ap dung toan repo.
