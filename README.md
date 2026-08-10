# KwikFix

Connect with trusted, vetted handymen in Abia State.

## Setup

```bash
npm install
npm run dev
```

## Firebase Configuration

KwikFix uses **Firebase Authentication** (email/password) and the
**Realtime Database** for user profiles.

### 1. Create a Firebase project

1. Go to the [Firebase Console](https://console.firebase.google.com) and create a project.
2. **Authentication** → Get started → enable the **Email/Password** provider.
3. **Realtime Database** → Create database → production mode → copy the
   `https://<project>-default-rtdb.firebaseio.com` URL.
4. **Realtime Database → Rules** — allow each user to read/write only their own profile:

   ```json
   {
     "rules": {
       "users": {
         "$uid": {
           ".read": "auth != null && auth.uid === $uid",
           ".write": "auth != null && auth.uid === $uid"
         }
       }
     }
   }
   ```

5. **Project settings** → Your apps → Web app (`</>`) → register the app and copy the SDK config values.

### 2. Add your config to `.env`

```bash
cp .env.example .env
```

Then fill in the values from your Firebase console app settings:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Restart `npm run dev` after adding the values.

## What is stored where

| Data | Location |
| --- | --- |
| Email / password accounts | Firebase Authentication |
| User profiles (`users/{uid}`) | Firebase Realtime Database |
| Bookings, jobs, notifications | Local app state (in-memory) |
| NIN / BVN | Local app state only — **not** written to Firebase (to be connected to a verification provider later) |
