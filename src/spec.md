# Specification

## Summary
**Goal:** Seed the Motoko product catalog with additional items for the existing brands (“Turtle Wax” and “3M”) so the homepage shows more products on a fresh install.

**Planned changes:**
- Update backend catalog initialization to include multiple seeded products for “Turtle Wax” and multiple seeded products for “3M” without requiring manual `addProduct` calls.
- Ensure all seeded products have unique `id` values and include `brand`, `name`, `shortDescription`, and `imgPath` (with `tags` optional).
- Keep `getAllProducts` returning products sorted by `id` ascending, and ensure each product’s `imgPath` either resolves to a valid in-app image URL or is left empty so the existing frontend fallback image is used.

**User-visible outcome:** On a fresh install, the homepage shows additional product tiles under both “Turtle Wax” and “3M” sections, with no broken product images.
