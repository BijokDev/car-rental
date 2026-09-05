# Project Documentation

_Last updated: 2026-09-05T14:20:00+08:00_

## Project Overview

TRAVTHRU is a web application providing premium airport transfer and private chauffeur services across Kuala Lumpur and Malaysia. It functions as an informational showcase, booking lead generator (routing customized inquiries to WhatsApp with pre-filled itineraries), and full administrative Content Management System (CMS). The CMS allows administrators to manage fleet vehicles, trip/fleet photo galleries, customer testimonials, SEO-optimized articles, and user roles.

## Tech Stack

- **Frontend Framework:** React 19, Vite, TypeScript
- **Routing:** React Router v7 (`react-router-dom`)
- **Styling:** Vanilla CSS & Tailwind CSS utility classes, UI Icons via `lucide-react`
- **Backend & Database:** Firebase (Authentication, Firestore NoSQL Database)
- **Asset Storage & Image Pipeline:** Custom Cloud Storage Service (`storage.bijokdev.com`) with automated server-side WebP conversion, dimension resizing, and client-side validation (`src/lib/imageUpload.ts` & `src/lib/storage.ts`)
- **Content Processing:** `marked` (Markdown parsing), `dompurify` (HTML sanitization)
- **SEO & Social Sharing:** `react-helmet-async`, automated sitemap generator (`generate-sitemap.js`), Open Graph & Twitter Cards, Schema.org JSON-LD structured data
- **AI Integration:** `@google/genai` (Google Gemini) for AI-assisted SEO article generation

## Folder Structure

- `components/`: Reusable UI components:
  - Navigation & Footer: `Navbar.tsx`, `Footer.tsx`, `WhatsAppButton.tsx`, `RebrandBanner.tsx`
  - Booking & Showcase: `BookingForm.tsx`, `Hero.tsx`, `Fleet.tsx`, `Gallery.tsx`, `Pricing.tsx`, `Services.tsx`, `HowItWorks.tsx`, `Features.tsx`, `WhyChooseUs.tsx`, `PopularRoutes.tsx`, `FAQ.tsx`, `Testimonials.tsx`
- `src/context/`: React context providers (`AuthContext.tsx` handling Firebase Auth and role-based permissions).
- `src/lib/`:
  - `firebase.ts`: Firebase client initialization (Auth, Firestore).
  - `storage.ts`: Client API wrapper for `storage.bijokdev.com` file storage with upload progress tracking and deletions.
  - `imageUpload.ts`: Image validation, upload pipeline, and storage integration for cars and gallery.
- `src/pages/`:
  - Public routes: `Home.tsx`, `ArticleList.tsx`, `ArticlePage.tsx`.
  - Admin CMS views (`src/pages/admin/`): `AdminLogin.tsx`, `Dashboard.tsx`, `CarEditor.tsx`, `ArticleEditor.tsx`.
- `public/`: Static assets such as `car-rental-images/`, official brand logos (`logo.png`, `logo-cropped.png`, `logo-mark.png`, `logo.svg`), multi-resolution favicons (`favicon.ico`, `favicon-32x32.png`, `favicon-16x16.png`, `apple-touch-icon.png`), and `robots.txt` / `sitemap.xml`.
- `root`: Config files (`vite.config.ts`, `tsconfig.json`, `package.json`, `vercel.json`, `middleware.js`).

## Security & Deployment

- **Hosting:** Vercel
- **Security Headers:** Strict headers (CSP, COOP, Referrer-Policy, strict CORS) configured via `vercel.json` and `middleware.js` to defend against XSS, clickjacking, and enforce privacy. Configured for Firebase Auth popups (`Cross-Origin-Opener-Policy: same-origin-allow-popups`).
- **SEO Optimization:** 100/100 Lighthouse SEO compliance via dynamic sitemap generation, structured schema markup, Open Graph tags, `.webp` image assets, `react-helmet-async`, and static DOM fallbacks for search engine crawlers.

## Database Collections (Firestore)

All database operations interact directly with Firebase Firestore using the client SDK with administrative role guards:

1. **`car-rental-cars`**
   - Stores the active fleet offerings.
   - Fields: `name` (string), `category` (string enum: SEDAN, MPV, LUXURY_MPV, VAN, BUS), `pricePerDay` (number), `priceTransfer` (number), `seats` (number), `luggage` (string), `features` (string array), `image` (string URL), `gallery` (string array of image URLs), `createdAt` (timestamp).
2. **`car-rental-gallery`**
   - Stores photos for the public fleet and trip experience gallery.
   - Fields: `url` (string), `caption` (string), `createdAt` (timestamp).
3. **`car-rental-testimonials`**
   - Stores customer reviews and feedback submitted on the public site or managed by admins.
   - Fields: `name` (string), `role` (string), `text` (string), `rating` (number), `approved` (boolean), `createdAt` (timestamp).
4. **`car-rental-articles`**
   - Stores SEO blog posts and travel guides.
   - Fields: `title` (string), `slug` (string), `content` (string markdown), `excerpt` (string), `image` (string URL), `author` (string), `published` (boolean), `createdAt` (timestamp), `updatedAt` (timestamp).
5. **`car-rental-users`**
   - Tracks authenticated users and administrative privileges.
   - Fields: `uid` (string), `email` (string), `displayName` (string), `photoURL` (string), `isAdmin` (boolean), `lastSignIn` (timestamp), `createdAt` (timestamp).

## Image Upload & Storage Pipeline

1. **Client Validation (`src/lib/imageUpload.ts` & `src/lib/storage.ts`):**
   - Validates MIME type against `image/jpeg`, `image/jpg`, `image/png`, `image/webp`, `image/gif`.
   - Restricts file size to a maximum of 10MB.
2. **Storage Service Integration (`storage.bijokdev.com`):**
   - Uploads via HTTP PUT with API key authorization.
   - Automatically handles image resizing and conversion to optimized `.webp` format server-side.
   - Returns full HTTPS CDN URL stored in Firestore documents.
3. **Modern Upload UI/UX:**
   - Real-time visual feedback: animated button spinners (`Loader2`), dynamic count indicators (`Uploading (2/4)...`), percentage progress bars, and in-place pulsing skeleton loaders in the image grids.
   - Immediate rendering: batch uploads display photos incrementally as each finishes uploading.
   - Error states: inline dismissible alerts replace browser popups.

## Recent Update Log

- **2026-02-21T22:05:39+08:00:** Comprehensive documentation generated across all endpoints and database models based on initial codebase snapshot.
- **2026-03-06T09:08:38+08:00:** Resolved major SEO scanner warnings (Keywords, Headings, Favicon, Internal Links) and implemented Vercel security headers.
- **2026-06-23T11:00:00+08:00:** Rebrand to TRAVTHRU. Booking Form restructured to support "Transfer" vs "By the Hour" flows with 100/100 Lighthouse SEO score.
- **2026-09-05T10:55:00+08:00:** Official TravThru brand logo suite integration (`logo.png`, `logo-cropped.png`, `logo-mark.png`, `logo.svg`, multi-resolution favicons, and Schema.org JSON-LD updates).
- **2026-09-05T14:20:00+08:00:** Modernized image upload pipeline (`storage.bijokdev.com`), added dynamic Fleet & Gallery CMS tabs, implemented public testimonial submission, and upgraded upload UI/UX with real-time progress indicators, skeleton loaders, and error states.
