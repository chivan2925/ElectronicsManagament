# SECURITY

## Current Security Posture

ElectronicsManagement currently has an admin/staff JWT authentication surface, protected storefront checkout/account routes, and sandbox VNPay/MoMo payment handoff. Public customer authentication is still not complete, so account ownership and customer-scoped APIs remain a Phase 7 production-hardening priority.

## Hardening Completed

- Backend admin APIs now enforce role/permission checks instead of relying only on authentication.
- Staff authorities include `ROLE_STAFF`, inferred `ROLE_ADMIN`, raw role/permission values, and normalized `PERM:*` permission authorities.
- JWT settings are validated on startup, JWT validation logs no longer include token-derived detail, and auth/forbidden responses use JSON with `no-store` headers.
- Frontend auth persistence now supports `VITE_AUTH_TOKEN_STORAGE=session` and stores only safe user display metadata.
- Staff responses no longer expose `hashedPassword`; token and reset-password responses use no-store cache headers.
- VNPay/MoMo callbacks validate required fields, signatures, merchant identity, amount, transaction ownership, and duplicate provider transaction ids.
- Media upload now restricts type, extension, size, magic bytes, and Cloudinary upload options for JPG/PNG/WEBP images.
- Backend exception handling now covers malformed JSON, missing parameters, type mismatches, validation errors, access denied, upload-size errors, multipart errors, and data integrity conflicts.
- Secrets and provider credentials are read from environment variables in `application.yml`; committed values are placeholders only.

## Operational Rules

- Do not commit real database, JWT, payment, or Cloudinary secrets.
- Set `ELECTRONICS_JWT_SECRET` to a unique 32+ byte secret outside source control.
- Set payment and Cloudinary credentials through environment variables per environment.
- Use `VITE_AUTH_TOKEN_STORAGE=session` for safer browser token persistence when possible.
- Disable Swagger/OpenAPI in production unless it is protected by network or auth controls.
- Keep payment return/IPN URLs aligned with deployed backend URLs.

## Known Remaining Risks

- Dedicated public customer auth is not complete.
- Backend customer account ownership checks still need a real customer principal contract.
- Refresh-token backend support is not implemented yet.
- Upload rate limiting and malware scanning are not implemented.
- Production migrations should replace Hibernate `ddl-auto:update` before deployment.
