# TrustStudy Prototype Plan

A mock-first frontend demo. No backend, no Lovable Cloud. All data lives in a single `src/mock/trustStudyData.ts` file so every screen reads from the same source and the demo stays consistent.

## Visual direction

- Modern, clean, trustworthy with a playful edge — Reddit comment energy + Google Docs margin comments + classroom warmth.
- Palette: soft paper background, deep ink text, indigo primary (trust), mint for verified, amber for disputed, rose for hallucinations, lavender for AI personas.
- Typography: Instrument Serif for display/hero, Inter for UI/body. Generous spacing, rounded-2xl cards, soft shadows, subtle grid texture on landing.
- Each AI persona has its own avatar color + emoji-style mark (Skeptic 🤨, Fact-Checker 🔍, Beginner 🌱, Explainer 📖, Defender 🛡️, Consensus 🤝).
- All tokens defined as semantic HSL variables in `src/styles.css` — no hardcoded colors in components.

## Routes (TanStack Start, file-based)

```
src/routes/
  __root.tsx            (existing — add nav + meta only)
  index.tsx             1. Landing
  chat.tsx              2. Study chat with AI tutor
  blog.tsx              3. Generated blog review (overview + scores)
  thread.tsx            4. Reddit-style threaded AI comments
  review.tsx            5. Visual Review — margin speech bubbles on paragraphs
```

Top nav links between all screens so reviewers can click through the demo. Each route gets its own `head()` meta.

## Screen-by-screen

**1. Landing (`/`)**
- Hero: tagline "AI made learning faster. Now we need to make it trustworthy."
- Sub: one-sentence pitch + primary CTA "Try the demo" → `/chat`, secondary "See a reviewed post" → `/review`.
- Three-up "How it works": Chat → Generate → Review.
- Persona row showing the 6 AI reviewers as cards.
- Footer.

**2. Study chat (`/chat`)**
- Two-pane: AI tutor chat on left, "Topic: Explain recursion in programming" sidebar with progress + key concepts captured.
- Pre-scripted mock conversation (user + tutor turns about recursion, base cases, stack frames, factorial example).
- Sticky bottom composer (disabled input with placeholder; "Send" appends next scripted turn).
- Prominent CTA "Turn this chat into a blog post" → navigates to `/blog`.

**3. Blog review (`/blog`)**
- Header: post title "Understanding Recursion: A Beginner's Guide" + byline "Drafted by AI tutor, reviewed by 5 AIs".
- Trust dashboard row of 4 cards:
  - Trust score (big number /100 with ring)
  - Verified claims count (mint)
  - Disputed claims count (amber)
  - Possible hallucinations (rose)
- Rendered blog body (6–8 paragraphs about recursion), paragraphs have subtle colored left-borders matching their review status.
- Two CTAs: "Open thread discussion" → `/thread`, "See visual review" → `/review`.

**4. Thread view (`/thread`)**
- Reddit-style: blog summary card at top, then nested AI comment cards.
- Each card: persona avatar, name, role badge, model tag (e.g. "Claude Sonnet 4.5"), upvote/downvote, timestamp, body, reply chain.
- Mix of agreement, dispute, counter-replies between personas (Skeptic challenges, Defender pushes back, Consensus summarizes).
- "Add AI Commenter" button (top-right) opens modal (see #6).
- Human comment composer at bottom.

**5. Visual Review (`/review`) — the wow moment**
- Google Docs-style layout: blog content centered in a paper-card column, wide right margin reserved for floating comment bubbles.
- Each reviewed paragraph has a colored highlight span (verified/disputed/hallucination) with a small persona badge pinned to its right edge.
- Hovering or clicking a highlight pops the persona's speech bubble into the margin with a connector line (CSS-only, mocked positions).
- Some paragraphs have multiple stacked bubbles from different personas (e.g. Fact-Checker verifies + Skeptic questions).
- Top toolbar: filter chips by reviewer + by status (verified / disputed / hallucination / all).
- Same trust score summary pinned to a small floating card top-right.

**6. Add AI Commenter modal**
- Triggered from `/thread` and `/review`.
- Built on shadcn `Dialog`.
- Step-style single form:
  - Provider: segmented control — Claude / ChatGPT (OpenAI) / Gemini (logos as inline SVG).
  - Model: `Select` populated based on provider (Claude → Sonnet 4.5, Opus 4, Haiku 4; OpenAI → GPT-5, GPT-4.1, o4-mini; Gemini → 2.5 Pro, 2.5 Flash).
  - Role: `Select` of the 6 reviewer roles.
  - API key: password input with "Stored locally for demo" helper text.
- Submit: closes modal, toast "Skeptic AI (Claude Sonnet 4.5) joined the review", optimistically appends a new comment card to local state.
- No real API calls. Key is not persisted.

## Shared components

```
src/components/trust/
  TopNav.tsx
  PersonaAvatar.tsx          (color + emoji per role)
  TrustScoreCard.tsx
  ClaimStatCard.tsx          (verified / disputed / hallucination variants)
  BlogParagraph.tsx          (status border + highlight spans)
  CommentCard.tsx            (used in thread, supports nesting)
  MarginBubble.tsx           (visual review speech bubble + connector)
  AddCommenterModal.tsx
  ReviewerBadge.tsx
src/mock/trustStudyData.ts   (chat transcript, blog paragraphs w/ claim ranges, comments, personas, model lists)
```

## Technical notes

- TanStack Router file routes; navigation via `<Link>`.
- shadcn components: `button`, `card`, `dialog`, `select`, `input`, `textarea`, `badge`, `tooltip`, `separator`, `scroll-area`, `tabs`, `toggle-group`, `sonner` for toasts.
- All colors as HSL CSS vars in `src/styles.css` (`--verified`, `--disputed`, `--hallucination`, `--persona-skeptic`, etc.) mapped through `@theme inline`.
- Add Instrument Serif + Inter via `<link>` tag in `__root.tsx` head (Tailwind v4 disallows remote `@import` in CSS).
- Lightweight motion: framer-motion for margin-bubble entrance and trust-score ring fill on `/blog`.
- No persistence; modal-added commenters live in component state.

Ready for your go-ahead — I'll build all six screens, the modal, the mock data file, and the design tokens in one pass.