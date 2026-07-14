# Future Features

## Full Mock Test Mode (Ready to Build)

The backend and frontend scaffolding for full test mode is already in place. The `mode` field distinguishes practice vs mock — only behavioral differences remain to be implemented.

### What Already Exists

**Backend:**
- `UserFullTestResult` model (`models/user-full-test-result.model.ts`) — stores per-part scores, per-question results, total scores, timeTaken
- `mode: "practice" | "mock"` field in schema — just needs to be toggled
- API routes: `GET /:id/full`, `POST /:id/full/submit`, `GET /:id/full/result`, `GET /full-results`
- Service methods: `getFullTest`, `submitFullTest`, `getFullTestResult`, `getUserFullTestResults`
- Unique index on `(userId, testId, skill)` — one result per user per test per skill

**Frontend:**
- `useFullTest` hook (`components/test/shared/useFullTest.ts`) — accepts `mode: "practice" | "mock"`, manages all-part answers, timer, submission, retry via `?retry=1`
- Listening full test page (`app/test/[testId]/listening/full/page.tsx`) — separate screens per part, audio autoplay, bottom nav
- Reading full test page (`app/test/[testId]/reading/full/page.tsx`) — separate screens per part, TestTimer, split pane, bottom nav
- Full test result page (`app/test/[testId]/[skill]/full/result/page.tsx`) — combined score, per-part breakdown, audio/script tabs, retake button
- Library pages show "Start Full Test" / "View Result" buttons with band score badges

### What Mock Mode Needs (vs current Practice mode)

| Feature | Practice Mode (done) | Mock Mode (to build) |
|---|---|---|
| Timer | Count-up (no limit) | Countdown (auto-submit at 0) |
| Submit button | Manual, last part only | Hidden — auto-submit on timer expiry |
| Audio controls | Visible play/pause | Hidden |
| Part navigation | User-controlled bottom nav | Auto-advance on timer |
| Audio auto-play | Forward navigation only | Auto-play always |
| Result page | Same | Same (reuse existing) |

### Implementation Notes

- Pass `mode="mock"` to `useFullTest` from a new route or query param (e.g. `?mode=mock`)
- Backend `submitFullTest` already accepts `mode` — add conditional time enforcement
- Frontend countdown timer can reuse existing `TestTimer` component with inverted logic
- Auto-submit: when countdown hits 0, trigger `handleSubmit()` automatically
- All scoring, result storage, result page, and library display work identically for both modes

---

## Other Potential Features

- **Writing / Speaking sections** — header links hidden, pages not built yet
- **Drills page enhancements** — currently basic, could add timed drills, streak tracking
- **Admin analytics** — full test attempt tracking, average scores per test, completion rates
