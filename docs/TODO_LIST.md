# Completion & Target Roadmap

_Last updated: 2026-02-21T22:05:39+08:00_

## Recent Updates Log

- **2026-02-21T22:05:39+08:00:** Admin Dashboard fully integrated with `car-rental-users`, `car-rental-articles`, and `car-rental-testimonials`.
- **2026-02-21T22:05:39+08:00:** Advanced Markdown Article Editor with live preview and AI Prompt integration implemented.
- **2026-02-21T22:05:39+08:00:** Booking Form WhatsApp integration stabilized with OpenStreetMap location auto-suggestions.

## Phase 1: Must-Fix before Prod

- [x] Set up Firebase Authentication (Google Auth) and protect Admin routes.
- [x] Create responsive Public Home Page components (Hero, Fleet, Pricing).
- [x] Implement Booking Form with WA routing.
- [x] Establish Firestore database connection and data contexts.
- [ ] Fix Firebase Auth COOP (Cross-Origin-Opener-Policy) Header popup closure warnings in strict environments.
- [ ] Configure proper Firestore Security Rules (currently implicitly open or undefined based on codebase visibility).

## Phase 2: Stabilization

- [x] Add rich-text/Markdown Article editing for SEO features.
- [x] Implement Admin Dashboard Tabs (Users, Testimonials, Articles).
- [x] Add fallback image URLs and secure storage uploads.
- [ ] Allow public users to submit new Testimonials from the frontend (currently only managed in Admin).
- [ ] Centralize loading and error states for improved UX in the Admin panel.
- [ ] Ensure `package-lock.json` security patches (if any) are applied.

## Phase 3: Enhancements

- [ ] Fully migrate WhatsApp Booking Flow to save data directly to Firestore as a "Booking Request" for internal tracking.
- [ ] Implement a dynamic checkout/payment gateway (Stripe or generic Bank Transfer logic).
- [ ] Develop an internal Booking Calendar for the Admin Dashboard.
- [ ] Connect `@google/genai` directly into the Node environment to auto-generate articles rather than just providing a copy-paste prompt.
