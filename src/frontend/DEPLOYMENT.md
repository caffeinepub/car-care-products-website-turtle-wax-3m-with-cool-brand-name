# Urban Wax Studio - Deployment Guide

This guide covers how to deploy the Urban Wax Studio application both locally for development and to the Internet Computer (IC) mainnet for production.

## Prerequisites

Before deploying, ensure you have the following installed:

- **Node.js** (v18 or later) and **pnpm** package manager
- **DFX** (Internet Computer SDK) - [Installation guide](https://internetcomputer.org/docs/current/developer-docs/setup/install)
- **Internet Identity** - Required for user authentication (automatically available on IC mainnet)

## Project Structure

- `backend/` - Motoko backend canister code
- `frontend/` - React + TypeScript frontend application
- `frontend/src/config.ts` - Network configuration (local vs ic)
- `frontend/.env` - Local development environment variables
- `frontend/.env.production` - Production (IC mainnet) environment variables

---

## Local Deployment

Local deployment runs the application on your machine for development and testing.

### Step 1: Start the Local Replica

Open a terminal and start the local Internet Computer replica:

