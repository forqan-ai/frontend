# Forqan — Frontend

Angular SPA for the **Forqan AI** Islamic e-learning platform. Deployed on Netlify with API proxying to the backend.

**Live:** https://forqan-e0o.pages.dev/  
**Backend API:** https://forqan-api.runasp.net

---

## About the Project

Forqan AI is an ITI graduation project that addresses the fragmentation and lack of personalization in online Islamic education.



---

## Islamic Learning Categories

The platform is structured around five core Islamic disciplines, which drive placement testing, personalized learning paths, and course categorization:

| # | Category | Arabic |
|---|---|---|
| 1 | Aqeedah (Islamic Creed) | العقيدة |
| 2 | Hadith & Sunnah | الحديث والسنة |
| 3 | Seerah & Tazkiyah | السيرة والتزكية |
| 4 | Qur'an & Its Sciences | القرآن وعلومه |
| 5 | Fiqh & Rulings | الفقه والأحكام |

---

## Tech Stack

| Concern | Technology |
|---|---|
| Framework | Angular 22 |
| Language | TypeScript 6 |
| Styling | Bootstrap 5 + custom CSS |
| Icons | Bootstrap Icons |
| HTTP | Angular HttpClient + JWT interceptor |
| Real-time | @microsoft/signalr 10 |
| Auth tokens | jwt-decode |
| Animations | Lottie Web, ngx-lottie, @lottiefiles/dotlottie-wc |
| Markdown rendering | ngx-markdown, marked |
| PDF generation | jsPDF + html2canvas |
| Select inputs | @ng-select/ng-select |
| Deployment | Netlify (with API proxy) |

---

## Application Structure

```
src/app/
├── Layout/
│   ├── public_layout/       # Navbar + footer wrapper for public pages
│   ├── dashboard_layout/    # Student and admin dashboard shells
│   └── teacher_layout/      # Teacher dashboard shell
├── core/
│   ├── guards/              # studentGuard, teacherGuard, adminGuard
│   ├── interceptors/        # JWT auth interceptor
│   ├── services/            # Shared services (auth state, notifications, etc.)
│   └── models/              # Core TypeScript interfaces
├── shared/
│   ├── components/          # Reusable UI components (cards, spinners, etc.)
│   ├── directives/          # Custom directives
│   ├── pipes/               # Custom pipes
│   ├── models/              # Shared TypeScript interfaces
│   └── pages/               # 404 (NotFound), Unauthorized
└── features/                # Feature modules (see below)
```

---

## Features

### Public Area

| Route | Component | Status |
|---|---|---|
| `/` | Home | Implemented |
| `/courses` | Courses browse with filters | Implemented |
| `/courses/:id` | Course details + enrollment CTA | Implemented |
| `/teachers` | Teachers browse | Implemented |
| `/teachers/:id/details` | Teacher public profile | Implemented |
| `/about` | About us page | Implemented |
| `/privacy-policy` | Privacy policy | Implemented |
| `/terms-and-conditions` | Terms and conditions | Implemented |
| `/contact-us` | Contact us | Implemented |
| `/help-center` | Help center | Implemented |

### Authentication

| Route | Component | Status |
|---|---|---|
| `/login` | Email + password login | Implemented |
| `/register` | Student registration | Implemented |
| `/confirm-email` | Email confirmation handler | Implemented |
| `/forgot-password` | Forgot password form | Implemented |
| `/reset-password` | Reset password with token | Implemented |
| `/check-email` | Post-registration email notice | Implemented |

Google OAuth button is present in the UI. The flow depends on backend Google auth configuration.

### Student Dashboard (`/student/...`)

Protected by `studentGuard`.

| Route | Feature | Status |
|---|---|---|
| `home` | Student profile overview | Implemented |
| `settings` | Account settings | Implemented |
| `settings/teaching-request` | Apply to become teacher | Implemented |
| `settings/my-certificates` | View earned certificates | Implemented |
| `courses` | Browse all courses | Implemented |
| `courses/:id` | Course details | Implemented |
| `courses/:id/checkout` | Course purchase | Implemented |
| `my-courses` | Enrolled courses | Implemented |
| `course-player/:id` | Video player + progress | Implemented |
| `certificate/:courseId` | Completion certificate (PDF download) | Implemented |
| `my-courses/course-feedback` | Rate a completed course | Implemented |
| `wishlist` | Saved courses | Implemented |
| `teachers` | Browse teachers | Implemented |
| `teachers/:id` | Teacher profile | Implemented |
| `learning-circles` | Explore learning circles | Implemented |
| `learning-circles/:circleId` | Circle details + chat | Implemented |
| `learning-circles/mine` | My joined circles | Implemented |
| `consultations` | My consultations list | Implemented |
| `consultations/:id` | Consultation details | Implemented |
| `home/pointPackages` | Buy points | Implemented |
| `home/pointPackages/checkout/:id` | Point purchase checkout | Implemented |
| `placement-test` | Level assessment test | Implemented |

### Teacher Dashboard (`/teacher/...`)

Protected by `teacherGuard`.

| Route | Feature | Status |
|---|---|---|
| `` (dashboard) | Teacher overview | Implemented |
| `profile` | Teacher profile management | Implemented |
| `create-course` | New course form | Implemented |
| `my-courses` | Course management list | Implemented |
| `course-builder/:courseId` | Module/lesson builder | Implemented |
| `lesson-content/:moduleId/:lessonId` | Lesson content upload (video/PDF) | Implemented |
| `quiz-builder/:quizId` | Add questions to a quiz | Implemented |
| `question-builder/:quizId/question/:questionId/options` | Add answer options | Implemented |
| `circles` | Teacher's learning circles | Implemented |
| `circles/create` | Create a new learning circle | Implemented |
| `circles/:circleId` | Circle management view | Implemented |
| `circles/:circleId/edit` | Edit learning circle | Implemented |
| `consultations` | Manage consultation requests | Implemented |
| `consultations/:id` | Consultation details | Implemented |
| `wallet` | Earnings and withdrawal | Implemented |

### Admin Dashboard (`/admin/...`)

Protected by `adminGuard`.

| Route | Feature | Status |
|---|---|---|
| `teaching-requests` | Review teacher applications | Implemented |
| `teaching-requests/:id` | Application detail + approve/reject | Implemented |
| `courses-review` | Review pending courses | Implemented |
| `profile-change-requests` | Approve profile change requests | Implemented |
| `bookings` | View all session bookings | Implemented |
| `withdrawals` | Teacher withdrawal requests | Implemented |
| `withdrawals/:id` | Withdrawal detail + action | Implemented |

### AI Chat

| Route | Feature | Status |
|---|---|---|
| `/chat` | Islamic knowledge assistant (Claude) | Implemented |

Conversation history is persisted per user. Markdown rendering is supported in the chat view.

### Payments

| Route | Feature | Status |
|---|---|---|
| `/payment-processing/:paymentId` | Paymob redirect handler | Implemented |
| `/payment-success/:paymentId` | Success confirmation | Implemented |
| `/payment-failed/:paymentId` | Failure page | Implemented |
| `/course-checkout/:id` | Course purchase flow | Implemented |
| `/checkout/:id` | Point package purchase flow | Implemented |
| `/pointPackages` | Point packages list (public) | Implemented |

### Live Sessions

Routed via `LIVE_SESSIONS_ROUTES`. Includes student booking flow and admin bookings management.

### Circle Chat

Real-time group chat inside learning circles using SignalR. Presence tracking shows who is online.

---

## Layouts

Three layout shells handle the structural differences between user roles:

- **PublicLayoutComponent** — full navbar (logo, nav links, auth buttons) and footer
- **StudentDashboardComponent** — sidebar navigation, student context
- **TeacherLayoutComponent** — teacher-specific sidebar, course/circle management nav
- **AdminDashboardComponent** — admin sidebar with moderation tools

---

## Guards

| Guard | Behavior |
|---|---|
| `studentGuard` | Redirects to login if not authenticated as student |
| `teacherGuard` | Redirects to login if not authenticated as teacher |
| `adminGuard` | Redirects to login if not authenticated as admin |

Role is extracted from the JWT on the client using `jwt-decode`.

---

## Interceptors

An HTTP interceptor automatically attaches the `Authorization: Bearer <token>` header to all outgoing API requests.

---

## SignalR Integration

Two hubs are connected:

- **CircleChatHub** (`/hubs/circle-chat`) — group messaging inside learning circles
- **NotificationHub** (`/notificationHub`) — push notifications for all users

The JWT token is forwarded via query string (`access_token`) for SignalR connections, handled by the backend.

---

## Deployment

Deployed on **Netlify** (free tier). The `netlify.toml` configuration:

- Builds with `npm run build`
- Publishes from `dist/Forqan/browser`
- Proxies `/api/*` → `https://forqan-api.runasp.net/api/:splat` (avoids CORS)
- Proxies `/hubs/*` → `https://forqan-api.runasp.net/hubs/:splat` (SignalR)
- Catches all remaining routes with `index.html` for SPA routing

A Netlify Edge Function at `functions/hubs/[[catchall]].js` handles WebSocket upgrades for SignalR in the Netlify environment.

---

## Local Development

```bash
cd frontend
npm install
npm start
```

The dev server runs on `http://localhost:4200`. API calls go directly to the backend URL configured in `src/environments/environment.ts`.

### Environment

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'https://forqan-api.runasp.net/api'
};
```

---

## AI Chat — Source References

The AI assistant returns source references alongside answers so students can verify information and navigate directly to the relevant content:

- **Video lessons** — the AI returns the exact timestamp (in seconds) within the video where the answer was found. The player can seek to that position directly.
- **PDF documents** — the AI returns the page number of the source chunk.

This is powered by the backend RAG pipeline: AssemblyAI transcribes video/audio with sentence-level timestamps; PdfPig (with Claude Haiku OCR fallback for scanned documents) extracts PDF text with page metadata. Both are chunked, embedded with BGE-M3, and stored in Qdrant.

