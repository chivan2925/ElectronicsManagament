# CODING_RULES

## Git Va File

- Khong revert thay doi cua nguoi dung neu chua duoc yeu cau.
- Khong commit build output:
  - `frontend/node_modules/`
  - `frontend/dist/`
  - `backend/electronics/target/`
- Chay npm trong `frontend/`.
- Root khong nen co `package-lock.json` neu root khong co `package.json`.

## Frontend

- Dung Tailwind CSS cho style.
- Dung lucide-react cho icon.
- Dung Recharts cho chart.
- Dung React Router cho route.
- Dung Axios client tu `src/api/client.js`.
- Khong hardcode API URL trong component.
- Khong de business logic phuc tap trong UI component.
- Khong duplicate component neu co the truyen props.

## Mock Data

- Mock data dat trong `src/data`.
- Data shape nen gan backend DTO de sau nay thay API de hon.
- Neu them mock data moi, dat ten ro ngu canh.

## API

- Base API lay tu `VITE_API_BASE_URL`, fallback `http://localhost:8080/api`.
- Admin token key: `admin_access_token`.
- Khi noi API that, xu ly loading/error/empty state.

## Backend

- Backend la Spring Boot tai `backend/electronics`.
- Uu tien sua dung pattern controller-service-repository-dto-mapper hien co.
- Khong de secret moi trong `application.yml`.
- Neu them migration/seed, uu tien file ro rang trong docs/database hoac migration folder neu du an chon Flyway/Liquibase sau nay.

## Validation Truoc Khi Bao Xong

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

Backend:

```bash
cd backend/electronics
mvn test
```

Neu khong chay duoc vi moi truong, ghi ro ly do.

## Chat/Tra Loi

- Tra loi ngan gon, dung trong tam.
- Neu co thay doi file, neu duong dan quan trong thi neu ro.
- Neu build/test fail, neu loi goc va buoc sua tiep theo.
