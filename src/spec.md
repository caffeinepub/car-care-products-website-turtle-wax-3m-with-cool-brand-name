# Specification

## Summary
**Goal:** Rename the site/app from "AutoGleam Supply" to "TorqueShine Supply" across all visible branding and metadata, and centralize the name in one frontend constant for easier future renames.

**Planned changes:**
- Update all user-facing occurrences of "AutoGleam Supply" to "TorqueShine Supply" in the header (brand text + logo alt text), About section (heading/body copy), and footer copyright.
- Update the HTML document title to start with "TorqueShine Supply".
- Introduce a single frontend constant/module as the source of truth for the site/app name and refactor relevant components to use it.
- Update the footer’s non-browser fallback identifier string for the attribution URL parameter to a slug matching the new name (e.g., "torqueshine-supply").

**User-visible outcome:** The UI consistently displays "TorqueShine Supply" (including page title), with no remaining visible references to "AutoGleam Supply"; future renames require changing the name in only one place.
