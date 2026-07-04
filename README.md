# BookMyHalwai

BookMyHalwai is a demo-ready catering marketplace for discovering trusted caterers, submitting booking requests, managing vendor operations, and reviewing the booking lifecycle.

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env.local` file and add your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Run Locally

```bash
npm run dev
```

Open http://localhost:3000 to view the app.

## Firebase Setup

1. Create a Firebase project.
2. Enable Authentication and choose Google and Phone providers.
3. Enable Firestore Database.
4. Enable Storage for vendor documents and media.
5. Copy the config values into `.env.local`.

## Deployment Steps

1. Build the app:

```bash
npm run build
```

2. Deploy to Vercel or any Node.js hosting platform.
3. Add the same Firebase environment variables in the deployment dashboard.
4. Ensure the Firestore security rules allow the demo workflows.

## Demo Accounts

- Admin: admin@bookmyhalwai.com
- Demo vendors are auto-seeded when Firestore is empty.
- Demo customers are auto-seeded when Firestore is empty.

## Demo Mode

If Firestore is empty, the app will auto-seed demo vendors, customers, bookings, and reviews for a polished first-run experience.
// CI/CD Test Sat Jul  4 10:16:07 UTC 2026
