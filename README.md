# JEE Ultimate 2.0: Frontend

A premium counselling and admission guidance site for IIT, NIT, IIIT and GFTI aspirants.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Motion (`motion/react`) · Lucide icons · Geist fonts (bundled locally)
No extra dependencies were added in Phase 2. The Career particle field is a small hand-written WebGL engine.

## How to run (Windows)

**Easiest:** double-click **`run-website.bat`** in this folder. It will:

1. check that Node.js is installed,
2. offer to stop an old copy of the site if one is still running on port 3000,
3. install packages on the first run,
4. clear the old build cache,
5. start the site and open http://localhost:3000.

Keep that window open while you use the site. Press `Ctrl + C` in it to stop.

**From a terminal** (VS Code: Terminal > New Terminal, opened in this folder):

```bash
npm install          # first time only
npm run dev:fresh    # clears the cache, then starts http://localhost:3000
npm run dev          # normal start
npm run build        # production build check
npm run lint
```

Requires Node.js 20.9 or newer (https://nodejs.org, LTS).

**Not seeing changes?** Stop every running `npm run dev` window, run `npm run dev:fresh`, then hard-refresh the browser with `Ctrl + Shift + R`. If the terminal says the site started on port 3001, an old copy is still using 3000: close it or open the address the terminal shows.

| Route | What it is |
|---|---|
| `/` | Homepage |
| `/college-lists`, `/previous-cutoffs`, `/ai-predictor` | Phase-1 section pages |
| `/counselling-support` | **Counselling Support hub** (see below) |
| `/counselling/[josaa · csab · uptac · jac-delhi]` | Per-counselling support: enrolment, dates, eligibility, documents, official links |
| `/testimonials` | Member stories (placeholder until real stories are added) |
| `/career` | **Signature Career experience** - its own visual world |
| `/design-system` | Living style guide (not in navigation, not indexed) |
| `/news`, `/news/[slug]`, `/portal/[role]`, `/contact`, `/privacy`, `/terms` | Supporting placeholders |

---

## Phase 2A - Design system

Open **`/design-system`** to see every token and component in one place.

### Tokens - `src/styles/`

| File | Contents |
|---|---|
| `tokens.css` | Primitives (`--ju-*`), semantic tokens (`--canvas`, `--fg`, `--accent`…), Tailwind theme mapping, breakpoints, widths, spacing rhythm, radii, shadows, blur, motion durations, z-index layers, and a **draft dark theme** |
| `typography.css` | `type-display`, `type-h1`-`type-h4`, `type-lead`, `type-body-lg`, `type-body`, `type-body-sm`, `type-caption`, `type-nav`, `type-button`, `type-label`, `type-meta`, `type-numeric`, `type-stat`, `type-stat-xl` |
| `surfaces.css` | Glass (`glass-subtle`, `glass`, `glass-prominent`, `glass-nav`, `glass-dark`, `glass-interactive`), brand gradients, glows, grid, masks, skeleton |
| `base.css` | Global base styles, focus ring, grain, and the reduced-motion safety net |
| `career.css` | The Career world's scoped palette and display utilities |

`src/lib/tokens.ts` mirrors the values JavaScript needs (breakpoints, z-index, world colours). `src/lib/motion.ts` holds the motion system: easings, durations, springs, named transitions and variants.

**Rebranding:** change `--brand-hue` (and optionally `--brand-chroma`) in `tokens.css`. The whole amber → orange scale is computed from it in OKLCH, and so are the gradients, glows, focus rings and accent shadows.

**Dark mode:** components only use semantic tokens. A draft dark palette is already in `tokens.css` under `[data-theme="dark"]`, and `/design-system` shows it applied. To ship dark mode later, set `data-theme` on `<html>` and fine-tune the values. No component changes are needed.

**Colour usage:**

| Class | Use |
|---|---|
| `bg-canvas` / `bg-surface` / `bg-surface-2` | Page and surfaces |
| `bg-contrast` + `text-on-contrast` | Dark slabs and primary buttons |
| `text-fg` / `text-fg-2` / `text-fg-muted` | Text. All pass AA contrast |
| `text-fg-subtle` | Decorative or large text only |
| `text-accent-text` | Accent-coloured text. Passes AA |
| `bg-accent`, `bg-accent-soft`, `bg-accent-gradient` | Brand moments |
| `success` / `warning` / `danger` / `info` (+ `-soft`) | Status colours |

**Spacing:** Tailwind's 4px scale, plus these named rhythm steps: `px-gutter`, `py-section`, `py-section-sm`, `mt-heading-gap`, `p-card-pad` and `gap-grid-gap`.
Named spacing tokens must not be CSS keywords such as `block`, `grid` or `flex`. Tailwind v4 also builds `inline-*` sizes from this namespace, so a token called `block` would break the `inline-block` class.

### Components - `src/components/`

```
ui/          Button · IconButton · Badge (Chip, StatusBadge) · Alert · Stat · Modal · Dropdown
             Container · Section · SectionHeading · Eyebrow · Icon · Spinner
glass/       GlassPanel (subtle · standard · prominent · nav · dark, interactive/active) · GlassButton
cards/       Card (standard · glass · feature · stat · interactive · minimal · contrast) · FeatureCard · IconTile
forms/       Field · Input · SearchField · Select · Textarea · Checkbox · Radio/RadioGroup · Toggle
layout/      Header · Navigation · GlassNav · MobileTabBar · NavLink · ProfileMenu · Logo · Footer · SiteChrome
motion/      AnimatedSection/Stagger · Counter · ScrollRevealText · PageTransition · WorldTransition · MotionProvider
home/ counselling/ news/ placeholder/   Page sections (unchanged paths from Phase 1)
career/      The Career world (see below)
design-system/  Style-guide page
```

**Button variants:** `primary`, `accent`, `secondary`, `outline`, `ghost`, `glass` and `link`. Every variant supports `loading`, `disabled`, `icon`, `leadingIcon` and `href`.

**Forms:** wrap any control in `<Field label hint error>`. The field connects the label, hint and error text to the control for screen readers and handles invalid and disabled states.

`components/ui/GlassPanel.tsx` now only re-exports the new component. It stays so older imports keep working.

### Accessibility

- A skip link, landmarks, `aria-current` on navigation, and labels on every icon-only button.
- A visible focus ring comes from one token, `--focus-ring`.
- Menus support the keyboard (arrow keys, Home/End, Escape). The modal traps focus and restores it when closed.
- Text colours meet WCAG AA contrast.
- **Reduced motion:** the `MotionConfig` setting and a CSS fallback reduce motion for users who ask for it. On `/career`, the particle field renders one still frame, the marquee stops, and the depth layers are hidden.

---

## Phase 2B - Career (`/career`)

The Career page is a separate world with a deep night palette, oversized type, and a live particle field. The field changes shape as the story moves forward.

**Story:**

| Section | Particle shape |
|---|---|
| Hero | A sphere ("every point of light is a decision") |
| Status band | - |
| The problem | Chaos |
| What we know | A mapped terrain |
| What's next | A helix |
| Five roles | A different shape and colour for each role |
| Talent network | The JEE Ultimate 2.0 mark |

Each role (all marked **Recruiting soon**):

| Role | Must have | Shape |
|---|---|---|
| Long-Form Editor | 15+ long-form videos edited | Knot |
| Short-Form Editor | 30+ shorts or reels edited | Broadcast rings |
| Mentor Counsellor | Student or graduate of an IIT, NIT or IIIT | Converging vortex |
| Social Media Lead | Proven growth on YouTube, Instagram & Facebook | Neural network |
| Tech Manager | Frontend, backend & Microsoft tools (Excel and more) | Lattice |

Edit names, descriptions and requirements in `src/data/career.ts`.

**Cursor effect:** particles near the cursor swell into a glowing bubble and flicker through characters (`0-9 ! @ # $ % ^ & * + = ? < > / { } [ ]`). Moving faster makes the bubble bigger and the characters change faster, and a comet trail follows the cursor. Clicking (or tapping) sends a ring of characters outward. Every few seconds a scan line decodes a strip of the field on its own, and the whole field breathes, so it never looks static. The characters come from a small glyph atlas drawn once on a canvas.

**Applications:** the bottom of the page shows a read-only "Applications open soon" panel (`ApplicationsSoon.tsx`) with nothing to type into. When you are ready to accept applications, set `applicationsOpen = true` in `src/data/career.ts` to bring back the form (and configure it as described below).

**Files:**

```
app/career/layout.tsx, fonts.ts   world fonts (Geist Pixel + static SemiBold) and dark theme colour
components/career/                CareerWorld (scene state) · ParticleField · StaticField · CareerNav
                                  CareerHero · SignalTicker · CareerStory · RoleField
                                  TalentNetwork · ApplicationsSoon · TalentForm · MagneticButton · CareerFooter
lib/career/particle-engine.ts     WebGL engine: GPU morphing, cursor glyph bubble, click ripple, scan line, adaptive quality
lib/career/formations.ts          shape generators
lib/career/capabilities.ts        device tiers
lib/career/talent-network.ts      form submission contract
data/career.ts                    all copy, roles, colours
```

**Performance tiers** are chosen per device in `capabilities.ts`:

| Tier | Particles | Behaviour |
|---|---|---|
| High (desktop) | 22k | Full animation |
| Medium | 14k desktop / 8k phones | Full animation |
| Low | ~4k | Full animation |
| Static (reduced motion) | - | One still frame |
| None (no WebGL) | - | CSS/SVG fallback |

- The engine lowers resolution, and then particle count, if frames run slow.
- It pauses when the tab is hidden and is loaded only on `/career`.

**World transition:** Career links on the main site use `<WorldLink>`, and so does "Back to JEE Ultimate 2.0" on the Career page. A circle in the destination world's colour grows from the click point, the route changes underneath, and then the veil fades. Users who ask for reduced motion navigate directly.

### Making the talent network live

First set `applicationsOpen = true` in `src/data/career.ts`. With no other configuration, the form validates input and then tells the visitor, honestly, that nothing was sent yet. To make it live, set **one** of these variables:

```bash
# .env.local
NEXT_PUBLIC_TALENT_NETWORK_ENDPOINT=https://your-form-endpoint   # receives a JSON POST
# or
NEXT_PUBLIC_CAREERS_EMAIL=careers@yourdomain.com                 # opens a pre-filled email
```

Once either is set, the status text changes to "Talent network open" automatically.

---

## Phase 2.1 updates

- **Name:** the brand is **JEE Ultimate 2.0** everywhere (`site.name` in `src/data/site.ts`).
- **No em dashes** anywhere in site copy. Keep it that way when adding content.
- **Official logo:** the badge lives at `public/brand/jee-ultimate-2.0-logo.png` (background removed). `Logo`, the favicon (`src/app/icon.svg`), `apple-icon.png`, the world transition and the Career nav all use it. On `/career`, the final particle scene draws the badge's ring and "2.0".
- **Home shortcut:** an icon-only Home button appears in the glass nav and the mobile tab bar on every page except the homepage. On `/career` it is a ring button that lights up on hover and crosses back with the world transition.
- **Maker credit:** `src/components/layout/MakerCredit.tsx`, in both footers. It reads "Crafted by a human, not a template"; on hover or focus it glitch-decodes into the maker's name, runs a colour flow, and bursts sparks from the cursor. It links to https://sujalnegi.tech in a new tab.

## Counselling Support (`/counselling-support`)

| # | Section | Component |
|---|---|---|
| 1 | Hero with ticket fan and jump links | `counselling-hub/HubHero.tsx` |
| 2 | "Which counselling do you need?" multi-select picker with themed support tickets | `counselling-hub/CounsellingChooser.tsx` |
| 3 | "Which counselling is for me?" two questions, personalised plan, sends picks to section 2 | same file |
| 4 | Status of each counselling + month calendar per counselling | `counselling-hub/CounsellingCalendar.tsx` |
| 5 | Seven-step journey (click or play) | `counselling-hub/JourneyStepper.tsx` |
| 7 | Why choice filling matters, with an animated allotment demo | `counselling-hub/ChoiceFillingDemo.tsx` |
| 9 | Counselling terms with small visuals | `counselling-hub/TermsExplorer.tsx` |
| 10 | Resources: guides, documents, seat matrix, cutoffs, official links, each with its own picker | `counselling-hub/ResourceHub.tsx` |
| 12 | JoSAA vs CSAB vs UPTAC vs JAC Delhi table | `counselling-hub/ComparisonTable.tsx` |
| 13 | Why JEE Ultimate 2.0, link to member stories | `counselling-hub/MembersCta.tsx` |

All sections sit side by side on large screens where it makes sense (2 and 3) and stack on phones. The picker (`CounsellingSelect.tsx`) is a themed listbox with full keyboard support.

**Where the content lives**

| File | What to edit |
|---|---|
| `src/data/counselling.ts` | Each counselling: colours, facts, eligibility, documents, official links, **enrolment price and link** |
| `src/data/counselling-calendar.ts` | Calendar events. Replace with 2027 dates when published and change `calendarYear` |
| `src/data/counselling-hub.ts` | Hero copy, quiz logic, journey, terms, resources, comparison, member stories link |

**Enrolment:** in `src/data/counselling.ts`, set `plan.price` (rupees, e.g. `4999`) and `plan.href` (payment or sign-up link) for each counselling. While they are `null`, the site shows "Price announced soon" and a locked "Enrolment opens soon" button.

**Member stories:** `membersCta.href` points to `/testimonials`. Add real stories there (with permission) or point it to your video page.

**Status** is worked out in the visitor's browser from today's date, so it moves from "Upcoming" to "Live now" to "complete" on its own. Facts and dates come from the official 2026 brochures and schedules; UPTAC round dates were revised during 2026 and use the latest reported dates.

## Still to configure

- **Social links:** replace the `#` placeholders in `socialLinks` (`src/data/navigation.ts`).
- **Site URL:** set `NEXT_PUBLIC_SITE_URL` for canonical URLs and the sitemap.
- **News:** connect a real source in `src/lib/news.ts`, then set `isSampleNews = false`.

## Content notes

- Updates (`/news`) are **sample content** and are labelled as such. They are no longer on the homepage; the footer links to them under Counselling → Updates.
- The homepage "Strategy board" is an illustrative example that uses no real data.
- The Career page makes no claim about open roles. It says "Recruiting soon" and shows no application form until `applicationsOpen` is turned on.

## Saarthi (the assistant)

Saarthi is the assistant in the floating mark at the bottom of every page
except `/career` and the `/portal` routes.

It answers only once a model key is present. Add **one** of these to
`.env.local` (see `.env.example`) and restart:

```
ANTHROPIC_API_KEY=...   # Claude
OPENAI_API_KEY=...      # GPT
GEMINI_API_KEY=...      # Gemini, has a free tier
```

Optional: `SAARTHI_PROVIDER` to force one, `SAARTHI_MODEL` to pin a model.

Without a key the panel still opens and says plainly that answers are not
switched on yet, instead of erroring. The key is read on the server only, in
`src/app/api/saarthi/route.ts`, and is never sent to the browser.

Saarthi's personality, rules and knowledge of this site live in
`src/lib/saarthi/prompt.ts`. That file is where to edit its voice, what it
refuses to guess, and which pages it links to.
