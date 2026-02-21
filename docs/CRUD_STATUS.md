# CRUD Operations Status

_Last updated: 2026-02-21T22:05:39+08:00_

This app utilizes Firebase Firestore. Following is the list of DB Collections (tables) and their implemented operations directly from the client.

## 1. `car-rental-users`

- **Create:** ✅ Implemented. Located in `src/context/AuthContext.tsx`. Fires automatically upon new Google Sign-in to provision public or admin profiles.
- **Read:** ✅ Implemented. Located in `src/pages/admin/Dashboard.tsx` under the Users tab.
- **Update:** ✅ Implemented. Located in `src/pages/admin/Dashboard.tsx` (`updateDoc` to toggle `isAdmin` role). Also updates `lastSignIn` on login.
- **Delete:** ✅ Implemented. Located in `src/pages/admin/Dashboard.tsx` (`deleteDoc`).

## 2. `car-rental-articles`

- **Create:** ✅ Implemented. Located in `src/pages/admin/ArticleEditor.tsx` (`addDoc` on save).
- **Read:** ✅ Implemented. Located in `src/pages/admin/Dashboard.tsx` (Admin list), `src/pages/ArticleList.tsx` (Public grid), and `src/pages/ArticlePage.tsx` (Single view).
- **Update:** ✅ Implemented. Located in `src/pages/admin/ArticleEditor.tsx` (Editing title/content) and `src/pages/admin/Dashboard.tsx` (Toggling `published` status).
- **Delete:** ✅ Implemented. Located in `src/pages/admin/Dashboard.tsx` (`deleteDoc`).

## 3. `car-rental-testimonials`

- **Create:** ❌ Not implemented. Public/Admin form to add a testimonial to Firestore is currently missing from the codebase.
- **Read:** ✅ Implemented. Located in `src/pages/admin/Dashboard.tsx` under the Testimonials tab.
- **Update:** ✅ Implemented. Located in `src/pages/admin/Dashboard.tsx` (Toggling `approved` boolean).
- **Delete:** ✅ Implemented. Located in `src/pages/admin/Dashboard.tsx` (`deleteDoc`).
