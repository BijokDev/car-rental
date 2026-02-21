# Project Documentation

_Last updated: 2026-02-21T22:05:39+08:00_

## Project Overview

TRAVTHRU (aj-taxi-kl) is a web application providing premium airport transfer and chauffeur services in Kuala Lumpur. It functions as an informational website and booking lead generator, directing customer quotes to WhatsApp. It features a React-based frontend with a Firebase backend for an administrator content management system (CMS) to manage users, testimonials, and SEO-optimized articles.

## Tech Stack

- **Frontend Framework:** React 19, Vite, TypeScript
- **Routing:** React Router v7
- **Styling:** Vanilla CSS / Tailwind CSS (suggested by utility classes), UI Icons via `lucide-react`
- **Backend & Database:** Firebase (Authentication, Firestore, Storage)
- **Content Processing:** `marked` (Markdown parsing), `dompurify` (HTML sanitization)
- **AI Integration:** `@google/genai` (Google Gemini)

## Folder Structure

- `components/`: Reusable UI components (e.g., `BookingForm.tsx`, `Navbar.tsx`, `Fleet.tsx`).
- `src/context/`: React context providers (`AuthContext.tsx` handling Firebase auth and user states).
- `src/lib/`: Firebase initialization (`firebase.ts`) and custom storage wrappers (`storage.ts`).
- `src/pages/`: Main application routes (`Home.tsx`, `ArticleList.tsx`, `ArticlePage.tsx`).
  - `src/pages/admin/`: Admin CMS views (`AdminLogin.tsx`, `Dashboard.tsx`, `ArticleEditor.tsx`).
- `public/`: Static assets such as `car-rental-images`.
- `root`: Config files (`vite.config.ts`, `tsconfig.json`, `package.json`).

## API Endpoints

_This project is completely serverless. There is no traditional backend. All data interactions are handled directly from the client via the Firebase SDK._

## Database Tables (Firestore Collections) & Migrations

Because Firestore is a NoSQL document database, there are no traditional migrations.

1.  **`car-rental-users`**
    - Fields: `uid`, `email`, `displayName`, `photoURL`, `isAdmin` (boolean), `lastSignIn` (timestamp), `createdAt` (timestamp).
2.  **`car-rental-testimonials`**
    - Fields: `name`, `role`, `text`, `rating` (number), `approved` (boolean), `createdAt` (timestamp).
3.  **`car-rental-articles`**
    - Fields: `title`, `slug`, `content`, `excerpt`, `image`, `author`, `published` (boolean), `createdAt` (timestamp), `updatedAt` (timestamp).

## Environment Variables

- `VITE_STORAGE_API_KEY`: Used for a designated external file storage API endpoint (`src/lib/storage.ts`).
- `VITE_GEMINI_API_KEY`: Mentioned in `README.md` for AI prompt generation/chatbot abilities.

## Recent Update Log

- **2026-02-21T22:05:39+08:00:** Comprehensive documentation dynamically generated across all endpoints and database models based on current codebase snapshot.
