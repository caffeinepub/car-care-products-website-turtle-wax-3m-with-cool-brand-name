# Specification

## Summary
**Goal:** Add a dedicated All Products listing and ensure uploaded product photos, pricing (MRP/discounted), wishlist, product details, and checkout display/flow work consistently across the storefront.

**Planned changes:**
- Add a new “All Products” page/route that fetches all products via the existing getAllProducts React Query hook and renders them in a responsive grid using the existing ProductCard UI.
- Update header navigation to include a clear link to the new All Products page while keeping existing links (Home, Cart, Wishlist, My Products) working.
- Standardize the 4 uploaded product photos into consistent square frontend assets under `frontend/public/assets/generated` and ensure images render across ProductCard, Product Details, Cart, Wishlist, and Checkout with fallback on load failure.
- Enhance “My Products” create/edit form to set `originalMrp`, `discountedPrice`, and `imgPath` (select from the new uploaded assets or enter a custom path) and persist via existing backend mutations.
- Update Product Details page to prominently show product image, MRP (strikethrough), discounted/selling price, and discount percentage badge when applicable, plus add-to-cart, wishlist toggle, and buy-now actions.
- Ensure checkout enforces delivery address capture, supports payment method selection (e.g., UPI/Card/COD), and shows selected address/payment method on the order confirmation page.
- Ensure wishlist add/remove works from listing cards and product details, and wishlist page shows correct images and prices with navigation to product details.

**User-visible outcome:** Users can browse a full catalog on an All Products page, see consistent product images and MRP/discounted pricing across product cards and details, manage wishlist/cart reliably, and complete checkout with address + payment method shown on confirmation.
