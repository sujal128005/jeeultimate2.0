# Build brief: internal operations console

You are building a self-contained module that will be dropped into an existing
Next.js application. Build only what is described here. No landing page, no
marketing pages, nothing outside the routes listed.

---

## 1. What this module does

An advisory service sells a paid programme online. Customers pay through a
payment gateway. Each paying customer then has to be handed to one of the
service's advisors, and the service needs to know, at any moment, who has been
handed over, to whom, and how far along each one is.

Today that handover is done by copying names out of the gateway dashboard and
pasting them into a chat group. People get missed. This module replaces that
with a console where paid customers arrive automatically, staff assign them,
and progress is tracked.

Four things must be true when you are done:

1. A completed payment creates a record here without anyone typing it.
2. Two staff members can work the assignment queue at the same time and never
   assign the same person twice.
3. An advisor sees only their own assigned people, and can tick off the steps of
   their work.
4. Management can see the whole picture as numbers, not as a chat log.

---

## 2. Stack. Fixed, not your choice

This has to merge into an existing codebase, so these are not suggestions.

| Thing | Version / choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack), React 19 |
| Language | TypeScript, `strict: true`, no `any`, no `@ts-ignore` |
| Styling | Tailwind CSS v4, configured in CSS (`@theme`, `@utility`). No `tailwind.config.js` |
| Data | PostgreSQL via Prisma. Schema given below |
| Auth | Session cookie: `httpOnly`, `secure`, `sameSite=lax`. Passwords hashed with argon2 or bcrypt, cost 12 or higher |
| Charts | Hand-written inline SVG, or a library under 15 KB gzipped. No Chart.js, no Recharts, no D3 bundle |
| Icons | `lucide-react` |
| Animation | `motion` (the `motion/react` import path). Use sparingly |
| Dates | `date-fns`, or the Intl API |

Hard rules:

- No UI kit. No MUI, no shadcn/ui, no Chakra, no Bootstrap, no Ant.
- No AI, no LLM calls, no chatbot, no "smart suggestions" anywhere in this
  module. This is deliberate. Do not add one.
- No global state library. React state, URL state, server components.
- Server-side data fetching in server components. Route handlers for mutations.
- Every mutation re-checks the caller's role on the server. Hiding a button is
  not access control.

---

## 3. Visual language

The parent application has an existing look and this module must not fight it.
Use these CSS custom properties. Never hardcode a colour; always use the token.

```
Surfaces   --canvas  --surface  --surface-2  --surface-3
Text       --fg  --fg-2  --fg-muted  --fg-subtle
Lines      --line  --line-strong
Brand      --accent  --accent-strong  --accent-soft  --accent-text  --on-accent
Inverse    --contrast  --on-contrast
Status     --success  --success-soft  --warning  --warning-soft
           --danger  --danger-soft  --info  --info-soft
Radius     --radius-xs --radius-sm --radius-md --radius-lg --radius-xl
           --radius-control --radius-card --radius-panel
Motion     --duration-instant --duration-fast --duration-base --duration-slow
Layers     --z-sticky --z-header --z-dropdown --z-overlay --z-modal --z-toast
```

Ship a `tokens.placeholder.css` defining all of them with sensible values so
your build runs standalone. It gets deleted on integration and the real one
substituted, so nothing may depend on a specific value, only on the name.

**The density you are aiming for.** This is an instrument panel, not a
marketing page. Think of a well-built desktop application: everything on one
screen, information first, decoration last.

- Panels with visible borders and clear titles, in fixed positions. Not a feed
  that reflows.
- Compact rows. Table rows 36 to 40px tall, not 72.
- Every number uses `font-variant-numeric: tabular-nums` so columns line up.
- Numbers right-aligned, text left-aligned, always.
- No card carousels, no hero images, no decorative illustration, no gradient
  behind text, no parallax.
- Keyboard first. Every table sorts from its header, every screen is reachable
  without a mouse, focus rings always visible.
- Empty states say what is missing in one line. No illustrations.

Corners, typeface and colour come from the tokens, so it still belongs to the
same application. The difference is density.

---

## 4. Roles

Four roles, stored as an enum on the user.

| Role | Can see | Can assign | Can edit progress |
| --- | --- | --- | --- |
| `OWNER` | Everything | Yes | Yes |
| `MANAGER` | Everything | Yes | Yes |
| `ANALYST` | Everything, read only | No | No |
| `MENTOR` | Only people assigned to them | No | Yes, own only |

`OWNER` and `MANAGER` have identical powers in this version. Keep them separate
anyway; they will diverge later.

`ANALYST` sees every figure and every row, including names, category, and which
advisor each person is with. `ANALYST` sees no assign controls at all: not
disabled, absent. An assign request from an `ANALYST` session is rejected 403 by
the server.

---

## 5. Data model

Deliver as `prisma/schema.prisma`. Add fields if you need them; do not remove or
rename these.

```prisma
enum Role        { OWNER MANAGER ANALYST MENTOR }
enum Category    { GEN EWS OBC_NCL SC ST UNKNOWN }
enum Gender      { MALE FEMALE OTHER UNDISCLOSED }
enum EnrolStatus { PAID ASSIGNED IN_PROGRESS COMPLETED REFUNDED CANCELLED }

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  name         String
  role         Role
  passwordHash String
  active       Boolean  @default(true)
  createdAt    DateTime @default(now())
  assigned     Enrolment[]  @relation("MentorAssignments")
  actions      AuditEvent[]
}

model Enrolment {
  id           String      @id @default(cuid())
  // From the gateway. Unique, so a repeated webhook cannot duplicate a row.
  paymentRef   String      @unique
  orderRef     String?
  amountPaise  Int
  currency     String      @default("INR")
  paidAt       DateTime
  planCode     String?
  manualEntry  Boolean     @default(false)

  fullName     String
  email        String
  phone        String?
  rank         Int?
  category     Category    @default(UNKNOWN)
  gender       Gender      @default(UNDISCLOSED)
  homeState    String?
  notes        String?

  status       EnrolStatus @default(PAID)
  mentor       User?       @relation("MentorAssignments", fields: [mentorId], references: [id])
  mentorId     String?
  assignedAt   DateTime?
  assignedById String?

  progress     Progress?
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  @@index([status])
  @@index([mentorId])
  @@index([paidAt])
}

// One row per enrolment. Each step is a timestamp, not a boolean, so the
// console can show both whether it is done and when.
model Progress {
  id              String    @id @default(cuid())
  enrolment       Enrolment @relation(fields: [enrolmentId], references: [id], onDelete: Cascade)
  enrolmentId     String    @unique
  firstCallAt     DateTime?
  checklistSentAt DateTime?
  shortlistSentAt DateTime?
  finalListSentAt DateTime?
  updatedAt       DateTime  @updatedAt
}

// Every assignment, reassignment and progress change. Append only.
model AuditEvent {
  id          String   @id @default(cuid())
  actor       User     @relation(fields: [actorId], references: [id])
  actorId     String
  action      String   // signin | assign | reassign | unassign | progress
  enrolmentId String?
  detail      Json?
  createdAt   DateTime @default(now())

  @@index([createdAt])
  @@index([enrolmentId])
}
```

The four progress steps must be labelled from one config file, never hardcoded
in JSX, because the labels change on integration:

```ts
// src/config/progress.ts
export const PROGRESS_STEPS = [
  { key: "firstCallAt",     label: "First call" },
  { key: "checklistSentAt", label: "Checklist sent" },
  { key: "shortlistSentAt", label: "Shortlist sent" },
  { key: "finalListSentAt", label: "Final list sent" },
] as const;
```

---

## 6. Payment intake

The gateway (Razorpay) posts a webhook when a payment succeeds. That webhook,
not the browser redirect, is the source of truth. Someone who closes the tab
straight after paying must still appear.

Build `POST /api/webhooks/payment`:

1. Read the raw body as text before parsing. Verify the `x-razorpay-signature`
   header as an HMAC SHA-256 of that raw body using `PAYMENT_WEBHOOK_SECRET`,
   compared in constant time. Reject 400 if it does not match, and log nothing
   from the body in that case.
2. Handle `payment.captured`. Answer 200 and ignore other event types.
3. Upsert on `paymentRef`. The same event delivered five times produces one row.
   Gateways retry. Assume they will.
4. Take name, email and phone from the payment. Take rank, category, gender and
   home state from the gateway's notes field when present, otherwise leave them
   null for staff to fill in.
5. Answer 200 quickly once stored. Do slower work after responding.

Also build `POST /api/enrolments` for `OWNER` and `MANAGER`, for someone who
paid outside the gateway. Those rows set `manualEntry = true` so they can be
told apart.

Never store card numbers, UPI handles, CVVs or any raw instrument detail. Store
the gateway's reference and the amount, nothing else about the instrument.

---

## 7. Screens

All under `/console`. Signed-out visitors go to `/console/signin`.

### 7.1 `/console/signin`

Email and password, one centred panel. Rate limit 5 attempts per 15 minutes per
IP and per email. The failure message is identical whether the email exists or
not. Write a `signin` audit event on success.

### 7.2 `/console` — Overview

`OWNER`, `MANAGER`, `ANALYST`. The numbers screen.

Six tiles across the top: total enrolled, assigned, unassigned, completed,
revenue collected, average time from payment to assignment.

Then a fixed panel grid:

- **Enrolments over time.** Daily bars, range switch 7 / 30 / 90 days / all.
- **Category split.** GEN, EWS, OBC-NCL, SC, ST, unknown. Count and percentage
  both shown as numbers, with a bar. Never a pie chart.
- **Gender split.** Same treatment.
- **Rank distribution.** Histogram. Bucket size is a named constant.
- **Revenue.** Collected total, this week, this month, and by plan code.
- **Load per advisor.** Horizontal bars, one per advisor, count assigned.
- **Assignment funnel.** Paid → assigned → in progress → completed, with the
  drop-off count printed between each pair.

Every tile states the period it covers. Every chart has a plain table behind a
"show numbers" toggle, because a screen reader cannot read a bar.

Filters across the top apply to the whole screen and live in the URL query
string so a view can be bookmarked and shared: date range, category, gender,
advisor, status.

### 7.3 `/console/assign` — Assignment board

`OWNER` and `MANAGER` only. This screen replaces the chat group and it is the
one that must not fail.

Unassigned queue on the left, one column per advisor on the right.

- A queue card shows name, rank, category, gender, home state, amount, and how
  long ago they paid. Anything older than 12 hours is flagged.
- Drag a card onto an advisor's column to assign.
- **Also** put a plain assign control on every card: a button opening a list of
  advisors, fully keyboard operable. Drag and drop alone is not acceptable, it
  fails on touch, on trackpads and for keyboard users. Both paths call the same
  server action.
- Checkboxes for multi-select, then assign the whole selection in one action.
- Reassign by dragging between advisor columns. Unassign by dragging back.

**The concurrency rule.** Two people will work this board at once. The server
decides, not the browser.

- Assignment is a conditional update: set `mentorId` only where the row is still
  unassigned and `updatedAt` equals the value the client last saw.
- If the condition fails, answer 409 with that row's current state. The board
  then shows, in place, "Already assigned to <name> a moment ago", refreshes
  that one card and leaves the rest untouched. Never a full page reload, never a
  silent overwrite.
- Reassigning someone already assigned is allowed but must be a deliberate
  second step with a confirm, not the same gesture as a first assignment.
- Write the `AuditEvent` inside the same transaction as the assignment.
- The board polls every 10 seconds and refetches on window focus, so each person
  sees the other's work without reloading.

### 7.4 `/console/advisors` — Advisor performance

`OWNER`, `MANAGER`, `ANALYST`.

One row per advisor: assigned count, completed count, and for each of the four
progress steps how many of their people have reached it, as "12 / 20" plus a
bar. Add median hours from assignment to first call. Every column sortable.

Expanding a row lists that advisor's people with their four ticks, so management
can see exactly where work has stalled.

### 7.5 `/console/enrolments` — The table

`OWNER`, `MANAGER`, `ANALYST`.

Every enrolment, one row. Columns: paid date, name, email, phone, rank,
category, gender, home state, amount, status, advisor, and the four steps as
compact ticks. Sortable, filterable, searchable by name, email, phone and rank.
Paginate at 50 with a page-size control.

Export the current filtered view to CSV, not behind a modal. `ANALYST` can
export too.

### 7.6 `/console/my` — An advisor's own list

`MENTOR` only, and only their own rows. Filter server side on the session user,
never client side on a full fetch.

Each person shows their details and four large checkboxes for the progress
steps. Ticking stores a timestamp and shows the date beside it. Unticking asks
to confirm, then clears it. Every change writes an audit event.

A "needs attention" band at the top: assigned over 24 hours ago with no first
call, or no final list within 7 days of the first call.

### 7.7 What `ANALYST` sees

The same screens as 7.2, 7.4 and 7.5 with no assign controls anywhere. Do not
build separate cut-down pages. Render the same components with the capability
switched off, so the two cannot drift apart.

---

## 8. Getting the numbers right

- Compute in SQL, not by loading every row into Node and reducing. Assume
  100,000 enrolments.
- Money is an integer in paise. Never a float. Format at the edge, for display
  only.
- "Average time to assignment" excludes rows never assigned, and prints the
  sample size beside it.
- Percentages that must total 100 are rounded so that they do, with the largest
  remainder absorbing the difference.
- A figure that cannot be computed shows a dash, never a zero. Zero and unknown
  are different facts and must look different.

---

## 9. Seed and demo data

Ship `prisma/seed.ts` creating:

- One user per role, four in total, plus three advisors with the `MENTOR` role.
- 120 enrolments spread over the last 90 days, a realistic spread of category,
  gender and rank, roughly 70% assigned, progress at varying stages.
- Passwords read from environment variables with obvious development defaults.

Say plainly in your README that these are development credentials that must be
replaced before any real data exists. Do not print a default password in the UI,
in a comment, or on the sign-in screen.

---

## 10. Security and privacy

This system holds names, phone numbers, email addresses and exam ranks of real
people, many of them seventeen or eighteen years old. Build it accordingly.

- Every route handler and every server component checks session and role on the
  server. No exceptions.
- No personal data in URLs, query strings, logs or error messages.
- Audit sign-in, assignment, reassignment, unassignment and progress changes:
  who, what, when. Never a password or a token.
- Mutations accept same-origin requests only; session cookie `sameSite=lax`.
- Rate limit sign-in and the webhook.
- No third-party analytics, tracking pixels, external fonts or CDN scripts
  inside this module. Everything self-hosted.
- No secrets committed. `.env.example` with names only.

---

## 11. What to deliver

A zip containing:

```
prisma/schema.prisma
prisma/seed.ts
src/app/console/**            every screen
src/app/api/**                webhook and mutation handlers
src/components/console/**     every component this module uses
src/lib/console/**            queries, auth, permissions, stats
src/config/progress.ts
src/styles/tokens.placeholder.css
.env.example
README.md
```

Rules for the delivery:

- Every file you add lives under one of those paths. Do not edit, or assume
  anything about, files outside them.
- No `node_modules`, no `.next`, no lockfile, no `.env`.
- Component and file names foldered under `console` so nothing collides on
  merge.
- `npx tsc --noEmit` clean. `npx eslint` clean on the Next.js default config.
- `npm run build` succeeds.
- README covers: environment variables needed, how to run migrations and the
  seed, the roles and what each can do, how to point the webhook at the app
  locally, and a list of anything you left unfinished. An honest list of gaps is
  worth more to us than a claim that everything works.

---

## 12. Acceptance checklist

Test these yourself before sending. They will be tested again on arrival.

1. Posting the same webhook payload five times creates exactly one enrolment.
2. A webhook with a wrong signature is rejected 400 and creates nothing.
3. Two browsers, one signed in as `OWNER` and one as `MANAGER`, both on the
   assignment board. Both drag the same person to different advisors within a
   second. One succeeds; the other is told it is already assigned and its board
   updates. No duplicate, no silent overwrite.
4. `ANALYST` sees no assign control, and a hand-crafted POST to the assign
   endpoint from that session returns 403.
5. `MENTOR` sees only their own rows, and a request for another advisor's
   enrolment returns 403 or 404, never the row.
6. Every table sorts, filters survive a reload through the URL, and the CSV
   export matches the filtered view exactly.
7. Every screen is usable at 1366 by 768 with no horizontal scrolling.
8. Tab through every screen with no mouse. Focus is always visible and nothing
   is reachable only by dragging.
9. With 100,000 seeded enrolments the overview loads in under two seconds and
   the table paginates without slowing down.
10. No personal data in the browser console, in network query strings, or in the
    server logs.

---

## 13. When something is unclear

Choose the more conservative option, write the choice down in the README, and
carry on. Do not invent a feature that is not described here, and do not leave a
described screen half-built in order to add one.
