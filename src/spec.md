# Specification

## Summary
**Goal:** Replace the Turtle Wax product card images with the user-uploaded photos and adjust pricing so MRP increases while Selling Price shows as a discounted value below MRP.

**Planned changes:**
- Add the 4 uploaded Turtle Wax photos as static assets under `frontend/public/assets/generated` and wire them to the correct Turtle Wax products by name.
- Update the frontend product image lookup/mapping (keyed by brand + name) so these Turtle Wax products resolve to the new asset paths without backend `imgPath` changes.
- Update pricing behavior so all products’ stored MRP increases by 200 INR (via upgrade migration) and the displayed Selling Price is strictly less than the displayed MRP.

**User-visible outcome:** On the homepage product grid, Turtle Wax product cards show the correct uploaded images, and every product card shows an increased MRP with a discounted Selling Price displayed below it.
