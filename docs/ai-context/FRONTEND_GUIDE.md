# FRONTEND_GUIDE

## Tech Stack

- React + Vite
- Tailwind CSS
- React Router
- Axios
- lucide-react
- Recharts

## Commands

```bash
cd frontend
npm install
npm run dev
npm run lint
npm run build
```

## Recommended Structure

```text
frontend/src/
├─ api/
│  └─ client.js
├─ components/
│  ├─ admin/
│  └─ client/shared components
├─ data/
│  ├─ mockAdminData.js
│  └─ mockData.js
├─ layouts/
│  └─ AdminLayout.jsx
├─ pages/
│  ├─ admin/
│  └─ Home.jsx
├─ utils/
│  └─ formatters.js
├─ App.jsx
├─ main.jsx
└─ index.css
```

When the client storefront grows, prefer splitting it into:

```text
components/client/
pages/client/
api/client/
api/admin/
```

## Component Rules

- Pages should compose layout and data flow.
- UI components should be small and have clear props.
- Do not create giant components containing multiple unrelated workflows.
- Use mock data from `src/data` while APIs are not ready.
- Use `src/api/client.js` for API integration; do not spread axios/fetch calls across many components.

## Routing

- `/` is reserved for the client storefront.
- `/admin` is reserved for the admin console.
- The fallback route should redirect to `/`.

## Naming

- Components: PascalCase, for example `ProductCard.jsx`.
- Data/util files: camelCase, for example `mockData.js`, `formatters.js`.
- Admin pages: short and clear, for example `Products.jsx`, `Orders.jsx`.

## Styling

- Use Tailwind CSS.
- Use color tokens from `tailwind.config.js` when possible.
- If a spec needs a specific color, controlled arbitrary classes are acceptable, for example `bg-[#050B14]`.
- Avoid single-note palettes. Client can be dark/blue; admin should remain light/blue.

## Verification

For frontend changes, run:

```bash
npm run lint
npm run build
```

If the build reports a large chunk warning because of Recharts/admin code, note it, but do not optimize the bundle unless the task requires it.
