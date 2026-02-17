# Specification

## Summary
**Goal:** Let users submit and manage in-app change requests, and finalize/improve product image selection and rendering (gallery/upload/custom path) with reliable previews and fallbacks across the app.

**Planned changes:**
- Add an in-app “Change Request” panel (accessible from the header or My Products) to submit free-text requests and persist them in localStorage with timestamps, listing, and delete actions.
- Update the My Products create/edit dialog to support three mutually exclusive image modes (Gallery, Upload, Custom Path) that correctly set/clear `imgPath`, validate uploads (image-only, max 5MB), and provide immediate preview updates.
- Ensure product images render correctly everywhere (product cards, product details, cart, wishlist) for `imgPath` values that are data URLs, empty, or broken, with a consistent fallback placeholder on error.

**User-visible outcome:** Users can submit and revisit change requests after refresh, and can reliably choose/upload/set product images with immediate previews; product images display consistently across the app with safe fallbacks when an image is missing or invalid.
