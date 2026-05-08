# ElectronicsManagament

ElectronicsManagament is an electronics and gaming e-commerce project with a React frontend and a Spring Boot backend.

## Current Scope

The storefront targets products such as:

- Phones
- Laptops
- Headphones
- Mice
- Keyboards
- Mouse pads
- Gaming PCs
- Prebuilt desktops
- PC components
- Gaming chairs
- Gaming accessories

## Tech Stack

Frontend:

- React + Vite
- Tailwind CSS
- React Router
- Axios
- lucide-react
- Recharts

Backend:

- Spring Boot REST API
- Spring Security + JWT
- JPA/Hibernate
- PostgreSQL

## Main Routes

Client:

- `/`: e-commerce homepage

Admin:

- `/admin`: admin dashboard
- `/admin/categories`
- `/admin/brands`
- `/admin/products`
- `/admin/variants`
- `/admin/media`
- `/admin/users`
- `/admin/staff`
- `/admin/roles`
- `/admin/orders`
- `/admin/warehouse`
- `/admin/coupons`

## Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Then open:

```text
http://127.0.0.1:5173/
http://127.0.0.1:5173/admin
```

## Run Backend

```bash
cd backend/electronics
mvn spring-boot:run
```

Default local database configuration is currently in:

```text
backend/electronics/src/main/resources/application.yml
```

## Documentation

Project working context and AI rules are in:

```text
AGENTS.md
docs/ai-context/
```

Before making structured changes, read `AGENTS.md`.
