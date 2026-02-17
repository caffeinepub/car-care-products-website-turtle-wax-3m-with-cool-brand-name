# Specification

## Summary
**Goal:** Add clear deployment documentation for local and Internet Computer (ic) mainnet, and ensure the frontend can be configured to target the correct network/canister IDs for production deployments.

**Planned changes:**
- Add an English deployment guide (README section and/or DEPLOYMENT.md) covering prerequisites, build steps, local deployment commands, mainnet deployment commands, and how to verify the deployed frontend and backend are reachable.
- Update frontend configuration to allow selecting target network (local vs ic) and correct canister IDs at build/runtime without editing immutable hook files.
- Document the exact environment variables/configuration values required for an ic (production) deployment and where they are defined.
- Add a post-deploy verification checklist covering loading the app, listing products, viewing product details, and authenticated add/update/delete from “My Products”, including Internet Identity login expectations and unauthenticated failure behavior.

**User-visible outcome:** A developer can follow the repository’s deployment instructions to deploy locally or to the IC mainnet, configure the frontend to point to the correct canisters/network, and verify core product browsing and authenticated “My Products” actions work after deployment.
