# CRUD Operations Status

_Last updated: 2026-09-05T14:20:00+08:00_

This app utilizes Firebase Firestore. Following is the list of DB Collections (tables) and their implemented operations directly from the client.

## 1. `car-rental-cars` (Fleet Management)

- **Create:** ✅ Implemented. Located in `src/pages/admin/CarEditor.tsx` (`addDoc` to create new vehicles with specifications, pricing, cover image, and gallery). Also supported via "Import Fleet" in `src/pages/admin/Dashboard.tsx`.
- **Read:** ✅ Implemented. Real-time subscription in `src/pages/admin/Dashboard.tsx` (Fleet tab) and public display in `components/Fleet.tsx` with category filters and photo carousels.
- **Update:** ✅ Implemented. Located in `src/pages/admin/CarEditor.tsx` (`updateDoc` to modify specs, pricing, features, or images).
- **Delete:** ✅ Implemented. Located in `src/pages/admin/Dashboard.tsx` (`deleteDoc` with image cleanup via `deleteImageFromStorage`).

## 2. `car-rental-gallery` (Fleet & Trip Gallery)

- **Create:** ✅ Implemented. Located in `src/pages/admin/Dashboard.tsx` under Gallery tab (`addDoc` on batch image uploads via `uploadImageToStorage`).
- **Read:** ✅ Implemented. Real-time subscription in `src/pages/admin/Dashboard.tsx` (Gallery tab) and public showcase in `components/Gallery.tsx`.
- **Update:** ✅ Implemented. Located in `src/pages/admin/Dashboard.tsx` (`updateDoc` to edit image captions/alt-text on blur).
- **Delete:** ✅ Implemented. Located in `src/pages/admin/Dashboard.tsx` (`deleteDoc` and `deleteImageFromStorage`).

## 3. `car-rental-testimonials`

- **Create:** ✅ Implemented. Public submission form in `components/Testimonials.tsx` allows customers to submit ratings and reviews (defaulting to `approved: false` pending admin review).
- **Read:** ✅ Implemented. Located in `src/pages/admin/Dashboard.tsx` (Testimonials tab with approved/pending moderation) and `components/Testimonials.tsx` (displays approved reviews with fallback hardcoded testimonials).
- **Update:** ✅ Implemented. Located in `src/pages/admin/Dashboard.tsx` (Toggling `approved` boolean).
- **Delete:** ✅ Implemented. Located in `src/pages/admin/Dashboard.tsx` (`deleteDoc`).

## 4. `car-rental-articles`

- **Create:** ✅ Implemented. Located in `src/pages/admin/ArticleEditor.tsx` (`addDoc` on save with AI outline prompt assistance and storage uploads).
- **Read:** ✅ Implemented. Located in `src/pages/admin/Dashboard.tsx` (Admin list), `src/pages/ArticleList.tsx` (Public grid), and `src/pages/ArticlePage.tsx` (Single view with SEO tags).
- **Update:** ✅ Implemented. Located in `src/pages/admin/ArticleEditor.tsx` (Editing title/content/markdown) and `src/pages/admin/Dashboard.tsx` (Toggling `published` status).
- **Delete:** ✅ Implemented. Located in `src/pages/admin/Dashboard.tsx` (`deleteDoc`).

## 5. `car-rental-users`

- **Create:** ✅ Implemented. Located in `src/context/AuthContext.tsx`. Fires automatically upon new Google Sign-in to provision user profiles.
- **Read:** ✅ Implemented. Located in `src/pages/admin/Dashboard.tsx` under the Users tab.
- **Update:** ✅ Implemented. Located in `src/pages/admin/Dashboard.tsx` (`updateDoc` to toggle `isAdmin` role). Also updates `lastSignIn` timestamp on login.
- **Delete:** ✅ Implemented. Located in `src/pages/admin/Dashboard.tsx` (`deleteDoc`).
