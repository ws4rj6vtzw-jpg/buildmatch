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
