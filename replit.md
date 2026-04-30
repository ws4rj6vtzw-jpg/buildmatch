# BuildMatch

A Tinder-style mobile app that connects construction builders with skilled workers.

## What it does

- **Phone + OTP onboarding** (mocked for MVP — any 6-digit code works)
- **Role selection**: builder or worker
- **Profile setup** with trade, skills, tickets/licences, location
- **Discover** — swipe deck of jobs (worker view) or workers (builder view) with PASS/MATCH stamps
- **Job board** with trade filters, post a job (builder), apply (worker)
- **Matches** list with chats — auto-reply demo for delight
- **Profile** with stats, skill pills, edit, role switch, sign out

## Stack

- Expo SDK 54, React Native 0.81, expo-router 6
- Frontend-only — AsyncStorage for persistence
- Inter font, dark theme (charcoal + safety yellow + orange accent)
- NativeTabs (liquid glass on iOS 26+) with classic Tabs fallback

## Structure

```
artifacts/buildmatch/
├── app/
│   ├── _layout.tsx           # Providers + Stack
│   ├── index.tsx             # Auth redirect
│   ├── onboarding/           # phone, otp, role, profile
│   ├── (tabs)/               # discover, jobs, matches, profile
│   ├── chat/[id].tsx         # 1:1 chat
│   ├── job/[id].tsx          # Job detail + applicants
│   └── post-job.tsx          # Builder job posting
├── components/               # SwipeCard, JobCard, Pill, Avatar, ScreenHeader, PrimaryButton
├── contexts/                 # AuthContext, DataContext (AsyncStorage-backed)
├── constants/                # colors, trades, seed data
└── types/index.ts
```

## Notes

- 6 seeded workers, 3 builders, 4 jobs to bring the swipe deck to life immediately
- Right-swipe in MVP demo simulates mutual interest and creates a match instantly
- Sending a chat message triggers a randomised auto-reply after ~1.4s (demo only)

## Marketing Landing Page (buildmatch-web)

A React+Vite web app at `/web` serving as the BuildMatch marketing site.

**Stack**: React, Vite, Tailwind CSS, Framer Motion

**Key files**:
```
artifacts/buildmatch-web/
├── src/pages/Home.tsx       # 8-section landing page (693 lines)
├── vite.config.ts           # PORT=8082 default, BASE_PATH=/web
└── .replit-artifact/artifact.toml
```

**CRITICAL: Port must be in 808x range**

The Replit workflow manager can only detect ports in the 808x range for development servers. Ports like 5173 (Vite default) and 3000 are invisible to the workflow health check. This artifact uses port **8082** (localPort=8082, BASE_PATH=/web).

All services use ports in their respective ranges:
- API server: 8080
- mockup-sandbox: 8081
- buildmatch-web: 8082
- expo: 25671
