# Run Project Locally

_Last updated: 2026-02-21T22:05:39+08:00_

## Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

## Step 1: Install Dependencies

Open your terminal in the project root directory and run:

```bash
npm install
```

## Step 2: Environment Setup

1. Verify the `.env` file exists at the project root for deployment configurations:

```env
VITE_STORAGE_API_KEY="my-secret-key-123"
```

_(Optional)_ Add `VITE_GEMINI_API_KEY=your_key` if working with the AI modules described in the original `README.md`.

2. The Firebase configuration is intentionally committed in `src/lib/firebase.ts` under the variable `firebaseConfig`. If you need to point this to a different Firebase bucket for local development, alter the configuration inside that file.

## Step 3: Database Migration

Because this project utilizes **Firebase Firestore** (a strictly NoSQL schema-less document database) exclusively through the frontend, **no manual database migrations are required**.

Whenever the app initializes a document (e.g. logging in for the first time via `AuthContext.tsx`), Firestore will auto-generate the `car-rental-users` collection.

## Step 4: Start the Dev Server

```bash
npm run dev
```

The application will boot using Vite and expose a local URL (e.g. `http://localhost:3000`).
Open the provided URL in your browser.

_(A Vite COOP Header warning might appear in terminal; ignoring it is fine locally as it is resolved by Firebase in Production)._
