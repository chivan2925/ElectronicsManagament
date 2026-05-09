# FILE_UPLOAD

## Purpose

This document describes the current backend file upload and media management flow.

Uploads are used for product and variant images.

## Current Upload Endpoint

```http
POST /api/admin/media/upload
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data
```

Form field:

```text
file
```

Current response:

```json
{
  "imageUrl": "https://...",
  "publicId": "electronics_store/example"
}
```

## Storage Provider

Current provider:

```text
Cloudinary
```

Main classes:

- `CloudinaryConfig`
- `SystemCloudinaryService`
- `SystemCloudinaryServiceImpl`
- `AdminMediaController`
- `AdminMediaServiceImpl`

## Upload Validation

Current service validation:

- Rejects files whose content type does not start with `image/`.
- Uploads accepted images to Cloudinary folder `electronics_store`.
- Returns the secure URL and public id.

Configured local size limits:

```text
max-file-size: 5MB
max-request-size: 5MB
```

## Media Persistence

Uploaded files are not automatically attached to a product or variant.

Typical flow:

1. Admin uploads an image through `/admin/media/upload`.
2. Backend returns `imageUrl` and `publicId`.
3. Frontend includes those values in a product, variant, or media request.
4. Backend creates a `media` row.

Relevant request DTOs:

- `AdminNestedMediaRequestDTO`
- `AdminAddMediaRequestDTO`
- `AdminUpdateMediaOrderRequestDTO`

## Media Ownership Rules

A media row should belong to one of:

- Product through `product_id`.
- Variant through `variant_id`.

It should not belong to both.

It should not belong to neither.

This is currently enforced in service logic for standalone media creation.

## Primary Image Rule

Endpoint:

```http
PATCH /api/admin/media/{mediaId}/primary
```

Behavior:

- Finds whether the image belongs to a product or variant.
- Sets all sibling images to `is_primary = false`.
- Sets the selected image to `is_primary = true`.

## Display Order Rule

Endpoint:

```http
PATCH /api/admin/media/{mediaId}/order
Content-Type: application/json
```

Body:

```json
{
  "displayOrder": 1
}
```

Use this for drag-and-drop or manual ordering in admin UI.

## Delete Behavior

Endpoint:

```http
DELETE /api/admin/media/{mediaId}
```

Current behavior:

- Deletes the database media row.
- Standalone media delete does not clearly guarantee Cloudinary cleanup.

Variant update behavior:

- When removed variant images are detected by missing `publicId`, service code attempts to delete the Cloudinary image and then delete the database row.

Rule:

- Keep Cloudinary cleanup and database cleanup aligned.
- Do not leave orphaned provider images after replacing media.

## Frontend Integration Notes

Recommended admin UI flow:

1. Select image file.
2. Upload file.
3. Store returned `imageUrl` and `publicId` in form state.
4. Render preview from `imageUrl`.
5. Submit product/variant/media request with both fields.

Do not submit local object URLs to the backend.

## Security Rules

- Require admin authentication for upload.
- Keep provider credentials on the backend only.
- Do not expose Cloudinary API secret to the frontend.
- Restrict accepted file types to images.
- Keep size limits conservative.
- Consider additional image validation before production.

## Future Improvements

- Normalize upload response docs and controller behavior.
- Add Cloudinary cleanup for all media delete paths.
- Add image dimensions or file size metadata if the UI needs it.
- Add server-side extension and magic-byte validation.
- Add rate limiting for upload endpoints.
