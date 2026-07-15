# Personal Portfolio Website Specification

## 1. Project Overview

### 1.1 Purpose

The website is a polished, professional personal portfolio that acts as an online CV for **Noam Pony**, a backend developer based in Israel.

The website should present Noam as:

- A backend-focused software developer
- Experienced in enterprise cloud development
- Security-aware
- Cloud-development oriented
- Technically disciplined
- Leadership-capable
- A continuous learner
- Professional, polished, and capable of building serious backend systems

The website should avoid feeling like a generic AI-generated portfolio. It should feel intentionally designed, technically mature, and suited to a backend developer with enterprise cybersecurity experience.

### 1.2 Target Audience

The website should be designed to impress and inform:

- Recruiters
- Engineering managers
- Technical interviewers
- Colleagues
- Family and friends

### 1.3 Target Impression

After visiting the website, users should feel that Noam is:

- Professional
- Technical
- Backend-focused
- Security-aware
- Leadership-capable
- Experienced
- A continuous learner
- Enthusiastic about engineering
- Capable of building and owning complex systems

### 1.4 Primary Goals

The website must:

- Present Noam’s professional identity clearly and quickly.
- Highlight backend, cloud, automation, DevOps, and cybersecurity experience.
- Showcase selected professional and volunteer projects.
- Demonstrate learning discipline through courses and certificates.
- Provide an accessible resume preview and download.
- Make professional contact easy.
- Support future expansion into detailed Projects and Courses pages.
- Be suitable for incremental implementation section by section, with each section completed fully before moving to the next.

### 1.5 Final Website Vision

The website should make visitors feel that Noam is a professional and enthusiastic backend developer who genuinely enjoys engineering. His differentiation should come from continuous learning, hands-on experience, proven ownership, and leadership.

---

## 2. Product Scope

### 2.1 MVP Scope

The MVP is the **Hero section only**, fully implemented and complete.

The Hero MVP must include:

- Name
- Professional title
- Short professional summary
- Resume CTA
- Contact CTA
- LinkedIn link
- Location
- Visual identity using a profile image or logo
- Responsive layout
- Basic polished animation
- Accessible semantic structure
- SEO-relevant page metadata for the homepage
- Production-ready deployment compatibility

### 2.2 Full Home Page Scope

After the MVP Hero is complete, the remaining homepage sections should be implemented one section at a time, with no unfinished trails before moving to the next section.

The planned homepage sections are:

1. Hero
2. My Impact
3. Experience
4. Projects Preview
5. Courses Preview
6. Technical Skills
7. Resume Preview
8. Contact Me
9. Floating Business Card
10. Optional Terminal Popup

### 2.3 Must-Have Requirements From Planning Template

The filled planning template marks the following as must-have:

- Home page
- Hero section
- My Impact section
- Experience section
- Projects preview
- Courses preview
- Skills section
- Resume preview/download
- Contact section
- Responsive design
- Basic animations
- Deployment to Vercel

### 2.4 Nice-to-Have Requirements

The following are nice-to-have and should not block the MVP:

- Terminal popup
- Easter egg
- Dark/light mode
- Course filters
- Project filters
- Blog
- Analytics
- Contact form
- CMS-like content editing
- Floating business card, unless later promoted to must-have
- Full Projects page, unless enough projects exist to justify it
- Full Courses page enhancements beyond basic display

### 2.5 Explicitly Out of Scope for Initial Specification

The following must not be implemented as part of this specification:

- Code implementation
- Task breakdown
- Phases
- AI coding-agent execution plan
- Deployment checklist
- Backend service implementation
- Authentication
- Admin dashboard
- Live CMS integration
- Private/internal work-system screenshots
- Internal company repositories
- Confidential employer architecture details
- Customer-specific data
- Sensitive cybersecurity workflows

---

## 3. Target Users

### 3.1 Recruiters

Recruiters should be able to quickly understand:

- Noam’s role
- Location
- Core technical stack
- Experience level
- Resume availability
- Contact options
- LinkedIn profile

### 3.2 Engineering Managers

Engineering managers should be able to evaluate:

- Backend ownership
- Cloud system experience
- System scale exposure
- Engineering maturity
- Team leadership
- Security awareness
- Ability to deliver production systems

### 3.3 Technical Interviewers

Technical interviewers should be able to identify:

- Backend architecture experience
- Cloud infrastructure familiarity
- Data handling and scale experience
- Testing and quality focus
- DevOps and CI/CD exposure
- Relevant projects for interview discussion

### 3.4 Colleagues

Colleagues should see a professional representation of:

- Noam’s technical profile
- Major project themes
- Work interests
- Learning path
- Contact and social links

### 3.5 Family and Friends

Family and friends should be able to understand the site at a high level and see a polished, impressive representation of Noam’s work and professional identity.

---

## 4. Information Architecture

### 4.1 Pages / Tabs

The website should include the following top-level pages or tabs.

| Page / Tab | Purpose | MVP Status |
|---|---|---|
| Home | Main one-page portfolio with top content from each section | Hero-only MVP, then full homepage |
| Projects | Full detailed project showcase | Conditional / nice-to-have |
| Courses | Full detailed courses hub | Conditional / nice-to-have |
| Resume | Optional dedicated resume page, modal, or direct resume view/download | Required as homepage behavior; page is TBD |

### 4.2 Home Page

The Home page is the primary page. It should present the strongest professional information in a one-page portfolio format.

Main content:

- Hero
- My Impact
- Experience
- Projects Preview
- Courses Preview
- Technical Skills
- Resume Preview
- Contact Me
- Floating Business Card
- Optional Terminal Popup

### 4.3 Projects Page

The Projects page should show all projects in depth.

Implementation is conditional. Before implementation, the project list must be reviewed to determine whether there are enough projects to justify a dedicated page. The planning template states that if there are fewer than 10 projects, this page may not be necessary.

Main content:

- Featured projects
- Project cards
- Filters by technology
- Filters by category
- Optional detailed project pages
- Optional live demo links

### 4.4 Courses Page

The Courses page should act as a full courses hub showing completed courses in a structured, attractive way.

Main content:

- Total completed courses stat
- Category breakdown
- Course cards
- Filters by category
- Filters by skills sharpened
- Certificate links or files
- Learning paths
- Featured courses

### 4.5 Resume Behavior / Page

The resume should be accessible through:

- Hero CTA
- Resume Preview section
- Navbar item
- Optional Floating Business Card link

The planning template allows either:

- A dedicated Resume page
- A resume modal
- A direct resume download/open behavior

Final resume behavior is **TBD**.

Required known resume file (filesystem location in the repo):

```text
/public/resume.pdf
```

> **Served-URL correction (Next.js):** Files placed in the `public/` directory are served from the site **root**, not under `/public`. The resume must therefore be linked/downloaded from the URL **`/resume.pdf`**, not `/public/resume.pdf` (the latter returns 404 in production). Throughout this spec, `/public/resume.pdf` denotes the repo path and `/resume.pdf` denotes the public URL.

Required download button text:

```text
Download CV
```

### 4.6 Other Pages

No additional pages are currently planned.

Potential future pages:

- Blog
- Analytics dashboard
- CMS-like content editing interface

These are nice-to-have only.

---

## 5. Navigation Requirements

### 5.1 Navbar Items

The main navigation must include:

- Home
- Projects
- Courses
- Resume

### 5.2 Sticky Behavior

The navbar must be sticky on scroll.

Acceptance criteria:

- Navbar remains accessible while scrolling.
- Navbar does not cover section headings or important content.
- Sticky behavior works on desktop, tablet, and mobile.
- Sticky navbar has sufficient contrast against page backgrounds.

### 5.3 Home Page Section Anchors

Home page sections should support anchor navigation where relevant.

Recommended section anchors:

| Section | Anchor |
|---|---|
| Hero | `#home` |
| My Impact | `#impact` |
| Experience | `#experience` |
| Projects Preview | `#projects` |
| Courses Preview | `#courses` |
| Technical Skills | `#skills` |
| Resume Preview | `#resume` |
| Contact Me | `#contact` |

### 5.4 Active States

Navigation should indicate the active page or section.

Acceptance criteria:

- Active state is visible but not visually noisy.
- On the homepage, active section highlighting should update while scrolling if implemented.
- On separate pages, the matching page nav item should be active.

### 5.5 Mobile Navigation

Mobile navigation must:

- Collapse into a mobile-friendly menu.
- Be keyboard accessible.
- Close when a navigation item is selected.
- Close when clicking outside the menu.
- Avoid blocking primary content permanently.

Mobile menu style is **TBD**.

### 5.6 Social Links

At minimum, the website must include a LinkedIn link:

```text
https://www.linkedin.com/in/noam-pony/
```

GitHub is mentioned as a skill/source area but a specific public profile link is **TBD**.

### 5.7 Resume Navigation Behavior

The Resume nav item should either:

- Navigate to a Resume section on the homepage,
- Open/download the resume at URL `/resume.pdf`,
- Open a resume modal,
- Or navigate to a dedicated Resume page.

Final behavior is **TBD**.

---

## 6. Visual Design Direction

### 6.1 Overall Style

The website should use a:

- Dark developer aesthetic
- Minimalist layout
- Polished professional visual system
- Backend-engineer-oriented feel
- Non-generic design language

The site should not look like a common AI-generated portfolio.

### 6.2 Style Inspirations

The planning template references the following sites:

| Reference | Reusable Ideas |
|---|---|
| `https://ankit-roy.netlify.app/` | Business card, terminal, GitHub stats style, skills look, projects section, projects page, credentials/learning paths inspiration |
| `https://kenzycodex.vercel.app/` | Main fields/services section, simple clean contact section, prominent years-of-experience placement |
| `https://hasan-ashab.vercel.app/` | Experience timeline, scroll-filled timeline, clean hero, small profile image with career stats |

### 6.3 Color Palette

The preferred palette is dark and developer-oriented.

Required (from planning):

- Dark background
- Strong text contrast
- Accent color for CTAs, links, active states, and highlights
- Avoid overly dark low-contrast surfaces
- Avoid generic neon-overload design

**Proposed palette (now specified — see note below).** Values are chosen to satisfy the requirements above and WCAG 2.1 AA contrast on the dark base. They are sensible defaults the owner may override, but they unblock the visual build. Implement as CSS custom properties / Tailwind theme tokens.

| Token | Hex | Role | Contrast note |
|---|---|---|---|
| `--bg-base` | `#0B0F14` | Page background (near-black slate, not pure black) | base layer |
| `--bg-surface` | `#141A22` | Card / section surface | distinct from base (avoids "all one black") |
| `--bg-surface-raised` | `#1C242E` | Hover / raised / nav surface | layered depth |
| `--border` | `#2A333F` | Card borders, dividers | visible separation on dark |
| `--text-primary` | `#E6EDF3` | Headings, primary body | ~14:1 on `--bg-base` ✓ AAA |
| `--text-secondary` | `#9FB0C0` | Secondary body, labels | ~7:1 on `--bg-base` ✓ AA |
| `--text-muted` | `#6B7A8A` | Captions, non-essential meta | large/decorative text only |
| `--accent` | `#2DD4BF` | **Primary accent** — CTAs, links, active states, highlights, focus ring | high contrast on dark; pair with `--bg-base` text on filled buttons |
| `--accent-hover` | `#5EEAD4` | Accent hover/active state | — |
| `--accent-contrast` | `#0B0F14` | Text/icon color on a filled accent button | dark-on-accent for AA |
| `--gradient-from` | `#2DD4BF` | Animated-gradient start (used sparingly) | — |
| `--gradient-to` | `#3B82F6` | Animated-gradient end (subtle blue companion) | keep low-opacity to avoid neon overload |
| `--danger` | `#F87171` | Form/validation errors only | not color-only; pair with text/icon |

Usage rules:

- **One** primary accent (`--accent`) only — the blue gradient companion is for subtle background/gradient accents, not a second button color, to avoid neon overload.
- Filled accent buttons use `--accent` background with `--accent-contrast` text. Links/active states use `--accent` as foreground on dark surfaces.
- All text/background pairings must verify ≥ 4.5:1 (normal text) or ≥ 3:1 (large text / UI components) with a contrast checker before shipping.

This palette supersedes the earlier "TBD" status; owner may substitute exact brand colors later without changing the token names.

### 6.4 Typography

Typography should be clean, professional, developer-oriented, highly readable, and suitable for both technical and non-technical audiences.

**Proposed fonts (now specified).** Chosen for a modern, developer-oriented but professional feel that fits the Next.js/Vercel stack and is not the generic default. Load via `next/font` (self-hosted, `display: swap`, primary family preloaded) — no render-blocking external font CSS.

| Role | Font | Fallback stack | Used for |
|---|---|---|---|
| Sans (UI / body / headings) | **Geist Sans** | `Inter, system-ui, -apple-system, sans-serif` | All prose, headings, navigation, buttons |
| Mono | **JetBrains Mono** | `ui-monospace, "SF Mono", Menlo, monospace` | Hero floating-code motif, terminal popup, stat numbers, tech-stack badges, inline code |

Type scale (baseline, mobile-first; scale up at `lg`):

| Token | Size / line-height | Use |
|---|---|---|
| `display` | 2.5rem / 1.1 (desktop up to 3.5rem) | Hero name |
| `h1` | 2rem / 1.2 | Section headings |
| `h2` | 1.5rem / 1.25 | Sub-section headings |
| `body` | 1rem / 1.6 | Default body |
| `small` | 0.875rem / 1.5 | Labels, captions |

Rules:

- Body line length capped at ~70–75 characters for readability.
- Use the mono family for "engineering texture" (code, terminal, numeric stats) — do not set long-form paragraphs in mono.
- Owner may swap families later; keep the Sans/Mono role split and the scale tokens.

This supersedes the earlier "TBD" status.

### 6.5 Layout Feel

The layout should feel:

- Modern
- Minimalist
- Structured
- Polished
- Spacious enough for readability
- Dense enough to feel like an engineering CV rather than a marketing landing page

### 6.6 Spacing and Density

Spacing should:

- Avoid cramped content.
- Avoid excessive whitespace that makes the site feel empty.
- Support clear visual hierarchy.
- Use consistent section padding across pages.
- Use responsive spacing for mobile screens.

### 6.7 Card Style

Cards should support:

- Project cards
- Course cards
- Experience cards
- Skill category cards
- Business card drawer

Preferred styles:

- Subtle hover effects
- Dark surfaces
- Glassmorphism where appropriate
- Terminal-style card for the Floating Business Card
- Clear borders or shadows for separation

### 6.8 Icon Style

Icons should be used for:

- Skills
- Contact methods
- Social links
- Technologies
- CTA affordances where appropriate

Icon source is planned as “scrape the internet,” but implementation should use safe and legal icon sources instead of uncontrolled scraping.

Icon source is **TBD**.

### 6.9 Dark / Light Mode

Dark mode is the primary expected visual direction.

Dark/light mode is marked as nice-to-have.

Acceptance criteria if implemented:

- User can toggle mode.
- Preference persists.
- Both modes meet accessibility contrast requirements.
- Dark mode remains the primary polished experience.

---

## 7. Animation and Interaction Guidelines

### 7.1 Desired Animation Style

Animations should feel professional and subtle.

Allowed animation types:

- Subtle fade-in
- Smooth scroll reveal
- Card hover effects
- Terminal typing animation
- Animated gradient background
- Floating business card animation
- Page transition animations
- Small professional polish effects

### 7.2 Animation Constraints

Animations must not:

- Distract from content.
- Make the site feel gimmicky.
- Reduce readability.
- Cause layout shift.
- Block navigation.
- Hurt performance.
- Depend on heavy animation libraries unless justified.

### 7.3 Reduced Motion

The site must respect reduced-motion preferences.

Acceptance criteria:

- If `prefers-reduced-motion: reduce` is active, non-essential animations are disabled or reduced.
- Essential interactions remain usable.
- Terminal typing animation should be replaced with static text or near-instant output under reduced motion.
- Scroll reveal should not hide content for reduced-motion users.

### 7.4 Hover Behavior

Cards and buttons should include subtle hover states.

Expected hover behavior:

- Slight elevation, border, glow, or transform
- Clear cursor affordance for clickable elements
- No large motion jumps
- No hover-only access to critical information

### 7.5 Section Reveals

Section reveals may be used after the Hero.

Acceptance criteria:

- Content is available without JavaScript where possible.
- Reveals do not interfere with SEO or screen readers.
- Reveals trigger once or in a controlled way.
- No content remains permanently hidden due to animation failure.

### 7.6 Floating Business Card Interaction

The Floating Business Card should:

- Be triggered by an always-visible floating button.
- Open from the left side.
- Close on outside click.
- Behave as a mobile-friendly drawer on mobile.
- Be accessible by keyboard.
- Trap focus while open if implemented as a modal/drawer.
- Restore focus to the trigger after closing.

### 7.7 Terminal Popup Interaction

Terminal popup is nice-to-have and must not be implemented before core website sections are complete.

Expected interaction:

- Open through a floating terminal button.
- Allow typed commands.
- Return predefined outputs.
- Support `help` and `clear`.
- Include a fun `easteregg` command.
- Remain keyboard accessible.
- Avoid interfering with screen readers or navigation.

---

## 8. Home Page Specification

## 8.1 Hero Section

### Purpose

The Hero section should make the website immediately feel professional, well-designed, and backend-focused.

The MVP is the Hero section only, and it must be fully complete before other sections are implemented.

### Required Content

| Item | Required Value |
|---|---|
| Name | Noam Pony |
| Professional title | Backend Developer |
| One-line summary | A passionate, experienced cloud backend developer |
| Location | Israel |
| Main CTA | Resume page or resume behavior |
| Secondary CTA | Contact section or contact page behavior |
| LinkedIn | `https://www.linkedin.com/in/noam-pony/` |

### Required Hero Text

```text
A passionate, experienced cloud backend developer.
Building scalable & reliable cloud backend systems.
```

### Short Tagline

Short tagline is currently empty in the planning template.

Status: **TBD**

### CTA Buttons

The Hero must include both CTA buttons, **rendered and styled**, but for the MVP they are **intentionally no-op** (they do not navigate or trigger any action yet). They are wired up later when their target sections exist.

1. Primary CTA (Resume):
   - Label: **TBD** (suggested default: `Resume`)
   - MVP behavior: **no-op** — renders as a styled button with no action.
   - Final behavior: **deferred.** To be wired when the Resume section (§8.7) is built — see the wiring note there.

2. Secondary CTA (Contact):
   - Label: **TBD** (suggested default: `Contact`)
   - MVP behavior: **no-op** — renders as a styled button with no action.
   - Final behavior: **deferred.** To be wired when the Contact section (§8.8) is built — see the wiring note there.

> **Implementation note:** Keep the buttons keyboard-focusable and visible, but do not attach a broken/placeholder destination (no `href="#"` that scrolls to top, no dead `/public/...` link). A no-op handler or a disabled-but-labelled state is acceptable for the MVP. They MUST be activated before launch — see §8.7 and §8.8 wiring notes.

### Visual Elements

The Hero should include:

- Noam’s picture or logo
- Animated Python code blocks floating in the background

Profile image source is **TBD**.

### Layout Behavior

Desktop:

- Hero should be above the fold or near above the fold.
- Text and CTAs should be immediately visible.
- Profile image/logo should be visible without overwhelming the layout.
- Floating code blocks should support the developer aesthetic without harming readability.

Mobile:

- Text should appear before or alongside the visual in a readable sequence.
- CTAs should be easy to tap.
- Floating code blocks should be reduced or hidden if they clutter the layout.

### Acceptance Criteria

- Hero displays Noam’s name, title, summary, location, LinkedIn, and CTAs.
- Hero uses the required hero text.
- Hero is responsive across desktop, tablet, and mobile.
- Hero has no placeholder content except explicitly marked TBD fields.
- Resume and Contact CTAs are rendered, styled, and keyboard-focusable, but are **intentionally no-op** in the MVP (no broken/dead links). Their final behavior is deferred to when the Resume (§8.7) and Contact (§8.8) sections are built.
- LinkedIn link opens safely in a new tab.
- Visual effects do not reduce readability.
- Hero passes basic accessibility checks for heading order, contrast, keyboard navigation, and CTA labels.
- Hero is production-ready as the MVP.

---

## 8.2 My Impact Section

### Purpose

The My Impact section should replace the previous About Me section and present selected career impacts in a concise, visual, carousel-based format.

The section should communicate concrete value Noam created across backend engineering, security product work, operational excellence, AI-assisted engineering, system design, and volunteer leadership.

### Section Name

Required section heading:

```text
My Impact
```

### Required Content

The section must include impact cards. Each card represents one impact Noam made in his career.

Each impact card must include:

- Impact title
- Short description
- Impact bullet list
- Optional icon or visual marker

### Impact Cards

#### 8.2.1 Catching Production Failures

| Field | Value |
|---|---|
| Title | Catching Production Failures |
| Description | Built the "last line of defense" that catches and reports critical failures in production while significantly improving visibility during crisis scenarios. |

Impact bullets:

- More reliable product
- Clearer picture during incidents
- Safer, more confident deployments

#### 8.2.2 System Architecture

| Field | Value |
|---|---|
| Title | System Architecture |
| Description | Designed 10+ backend systems from the ground up - architecture, documentation, planning, testing, and rollout. |

Impact bullets:

- Less rework and fewer late design changes
- Potential bugs found during planning, not in production
- Smoother path from design to delivery
- Higher-quality, more reliable systems

#### 8.2.3 Legacy System Modernization

| Field | Value |
|---|---|
| Title | Legacy System Modernization |
| Description | Refactored three legacy systems to improve code quality, reliability, and maintainability. |

Impact bullets:

- Cleaner, easier-to-maintain code
- Better monitoring and debugging
- More stable and scalable in production
- Up to date frameworks, methodologies, and architecture

#### 8.2.4 Supporting At-Risk Teenagers

| Field | Value |
|---|---|
| Title | Supporting At-Risk Teenagers |
| Description | Enhanced the monitoring platform used by a non-profit organization supporting at-risk teenage girls. |

Impact bullets:

- 3× faster monitoring and case management
- More reliable, easier-to-access data
- Helped staff reach the girls most at risk sooner

#### 8.2.5 AI Tooling for the Team

| Field | Value |
|---|---|
| Title | AI Tooling for the Team |
| Description | Built plugins for AI coding agents that automate everyday engineering tasks - opening PRs, reviewing code, and resolving tickets. |

Impact bullets:

- Made AI tools easier for the whole team to use
- More of the team using AI in daily work
- Less time spent on repetitive development tasks

#### 8.2.6 Grafana Dashboards

| Field | Value |
|---|---|
| Title | Grafana Dashboards |
| Description | Created dozens of Grafana dashboards to monitor services, performance, and production health in real time. |

Impact bullets:

- Faster investigation when something breaks
- Clear view of production health at all times
- Became the team's go-to for Grafana

#### 8.2.7 Team Knowledge Base

| Field | Value |
|---|---|
| Title | Team Knowledge Base |
| Description | Built a central hub for services, guides, templates, incident resolution playbooks, and engineering knowledge. |

Impact bullets:

- Faster knowledge sharing across the team
- Easier onboarding and daily development
- Less time hunting for information
- Faster production incident resolution using playbooks

#### 8.2.8 Weekly Security Reports

| Field | Value |
|---|---|
| Title | Weekly Security Reports |
| Description | Redesigned the weekly report customers receive, making their security incidents and activity easy to understand. |

Impact bullets:

- Customers see clearly what the product does for them
- Read by technical leaders and senior managers alike
- Helped sales teams demonstrate product value

#### 8.2.9 Unlocking Google & Microsoft Data

| Field | Value |
|---|---|
| Title | Unlocking Google & Microsoft Data |
| Description | Made hundreds of Microsoft 365 and Google Workspace event types available through a single service, turning raw data into security insight. |

Impact bullets:

- Powers multiple customer-facing features
- Enables detection of malicious activity
- Opened the door to future product capabilities

### Carousel and Animation Requirements

The My Impact cards must appear in a carousel using the Circular Gallery animation from React Bits animations.

Implementation requirements:

- Use a Circular Gallery / Circle Gallery style interaction from React Bits or an equivalent local implementation that matches React Bits' circular carousel behavior.
- The carousel must visually match the existing website style: dark surfaces, subtle borders, accent highlights, polished card hover/focus states, and the palette defined in §6.3.
- The carousel must auto-advance to the next card every 5 seconds.
- Auto-advance must pause while the active card or carousel is hovered by the mouse.
- Auto-advance should also pause while the carousel or a card has keyboard focus to avoid moving content while a keyboard user is interacting with it.
- Users must be able to move to the previous or next card using visible buttons on both sides of the carousel.
- Users must be able to move through cards by scrolling sideways.
- Touch and trackpad horizontal gestures should work where supported.
- Carousel controls must be keyboard accessible and have descriptive accessible labels.
- The carousel must respect `prefers-reduced-motion`; under reduced motion, use no auto-advance or a non-motion card list/fade behavior.

### Layout Behavior

Desktop:

- The carousel should be visually prominent without overwhelming the page.
- The focused/active impact card should be readable and clearly emphasized.
- Side navigation buttons should be visible and aligned with the carousel.
- Cards should maintain consistent dimensions to prevent layout shift.

Mobile:

- The carousel must remain readable and touch-friendly.
- Side buttons may remain visible or adapt to compact controls if space is limited.
- Horizontal scrolling must not cause page-level horizontal overflow.
- Long impact bullets should wrap cleanly.

### Security and Confidentiality Rules

The My Impact section must not expose:

- Internal company project names unless approved for public use
- Internal architecture details
- Customer names or customer data
- Internal repositories
- IP addresses, domains, or hostnames
- Logs or screenshots from work systems
- Sensitive cybersecurity workflows
- Proprietary implementation details

Impact wording should remain outcome-focused and public-safe.

### Acceptance Criteria

- Section heading is `My Impact`.
- The previous About Me content, stats, and paragraph are removed from this section.
- All required impact cards are represented.
- Each card includes title, description, and impact bullets.
- Cards use styling consistent with the website's dark developer aesthetic.
- Cards appear in a Circular Gallery carousel inspired by React Bits animations.
- Carousel auto-advances every 5 seconds.
- Auto-advance pauses on mouse hover and keyboard focus.
- Users can navigate with left/right carousel buttons.
- Users can navigate by sideways scrolling or horizontal gestures.
- Carousel is responsive across desktop, tablet, and mobile.
- Carousel controls are accessible by keyboard and screen readers.
- Reduced-motion preferences are respected.
- No confidential employer details are exposed.

---

## 8.3 Experience Section

### Purpose

The Experience section should show professional experience and leadership experience using a timeline style with animations.

### Layout Preference

The preferred layout is:

- Timeline
- Cards
- Description per card
- Optional screenshots

Screenshots are optional and must comply with confidentiality constraints.

### Experience Entries

#### 8.3.1 Max Impact

| Field | Value |
|---|---|
| Organization | Max Impact |
| Organization type | Non-Profit Association |
| Role | Team Leader |
| Type | Volunteer |
| Dates | September 2024 – October 2025 |
| Duration | 1 year, 1 month |
| Team size | 3–5 volunteer developers |
| Technology | Bubble.io |
| Link | `https://www.linkedin.com/feed/update/urn:li:activity:7305508419812126722/` (tracking query params such as `lipi` MUST be stripped before publishing — they encode a personal session/tracking token) |

Description:

```text
As a volunteer Team Lead at Max Impact, I led a team of junior developers in building a web platform that helps a non-profit organization provide better support for at-risk teenage girls. Beyond delivering the product, I mentored aspiring developers, helping them gain real industry experience and launch their careers, while combining technology with meaningful social impact.
```

#### 8.3.2 Check Point Software Technologies — Cloud Backend Software Developer

| Field | Value |
|---|---|
| Company | Check Point Software Technologies |
| Role | Cloud Backend Software Developer |
| Dates | Oct 2022 – Present |
| Duration | Calculate dynamically or mark current |
| Public company wording | Company name explicitly |

Description:

```text
I build and own cloud backend services for a large-scale email security product. I designed several of its high-traffic systems from scratch. Main framework used are Python, Docker, and AWS. I work closely with developers, QA, and product teams to ship reliably at scale, and I led monitoring and operational improvements across the team. Along the way I went deep on AI-assisted development - coding agents are now a core part of how I build. Today I'm the team's go-to person for owning services, debugging production issues, and sharing knowledge.
```

Confidentiality note:

- This description must be reviewed before publication to ensure it does not expose internal company project names, sensitive internal architecture, customer data, or proprietary metrics beyond what is safe to publish.

#### 8.3.3 Check Point Software Technologies — Malware Analyst

| Field | Value |
|---|---|
| Company | Check Point Software Technologies |
| Role | Malware Analyst |
| Dates | Dec 2021 – Oct 2022 |
| Duration | 11 months |

Description:

```text
Researched newly disclosed security vulnerabilities, reproduced the attacks they enable, and built the protections that block them for Check Point's customers. Wrote Python automations to cover more attacks and speed up the team's day-to-day work, focusing on network-level attacks.
```

#### 8.3.4 Private Tutor

| Field | Value |
|---|---|
| Role | Private Tutor |
| Employment type | Self-employed |
| Subject | C# programming private lessons |
| Audience | High school students |
| Dates | TBD |

Description:

```text
Taught private C# programming lessons to high school students.
```

### Confidentiality Rules

The Experience section must not include:

- Internal company project names unless approved for public use
- Internal architecture details
- Customer names or customer data
- Internal repositories
- IP addresses, domains, or hostnames
- Logs or screenshots from work systems
- Sensitive cybersecurity workflows
- Non-public metrics unless explicitly approved

### Acceptance Criteria

- Experience is displayed as a timeline or timeline-like card layout.
- Each entry includes company/organization, role, dates, and description.
- Volunteer leadership experience is clearly represented.
- Current role is clearly represented.
- Date ranges are accurate or marked TBD.
- Screenshots are omitted unless explicitly approved.
- Confidentiality constraints are enforced.
- Timeline animations do not block content visibility.

---

## 8.4 Projects Preview Section

### Purpose

The Projects Preview section should show the top 3–5 projects on the homepage and link to the full Projects page.

### Number of Projects

The homepage should show 3–5 projects.

The content data provides 6 projects.

### Layout Preference

Preferred layout:

- Featured large project plus smaller cards

This layout is not confirmed as mandatory.

### Required Project Card Fields

Each project card should include:

- Project name
- Short description
- Problem solved
- Tech stack
- Backend focus

### Project 1: Microsoft & Google Event Streaming

| Field | Value |
|---|---|
| Name | Microsoft & Google Event Streaming |
| Role | Project Leader |
| Short description | Built an end-to-end service that subscribes to Microsoft and Google activity APIs, receives events through webhooks, and processes and stores billions of them every week. |
| Problem solved | The product needs to know what's happening inside customers' Microsoft and Google accounts. This service brings in that raw activity data reliably, at full scale. |
| Tech stack | AWS, Python, Docker, Jenkins, System Design, Prometheus, DevOps |
| Backend focus | A high-scale pipeline processing billions of events weekly |
| Why important | These events feed the security scans that catch malicious activity. |

Security note:

- Confirm that the project name, scale, and description are safe to publish.

### Project 2: Email Archiving Service

| Field | Value |
|---|---|
| Name | Email Archiving Service |
| Role | Developer in a team |
| Short description | Implemented long-term email archiving together with my team - emails stored for years and searchable in full. |
| Problem solved | Companies often must keep emails for years, mainly for legal reasons. The service stores them long-term and lets users search everything - email bodies and attachments included - and import or export their archive. |
| Tech stack | AWS, Python, Docker, DevOps, Vector Database, Apache Iceberg, AWS Athena, System Design |
| Backend focus | Fast search over a huge, always-growing dataset |
| Why important | A major product capability that helped bring in new customers. |

Security note:

- Confirm whether product impact wording and architecture technologies are safe to publish.

### Project 3: Delivery Safety Net

| Field | Value |
|---|---|
| Name | Delivery Safety Net |
| Role | Project Leader |
| Short description | Implemented the system's end-to-end "last line of defense". When something gets stuck in the processing pipeline, this service catches it and delivers it to the customer anyway. |
| Problem solved | Nothing gets lost silently - anything that fails normal processing is found and still reaches the customer. |
| Tech stack | AWS, Python, Docker, Nagios, Prometheus, DevOps, System Design |
| Backend focus | Very high scale and heavily monitored - the one component that must never fail. |
| Why important | It backs the product's promise that everything customers expect actually arrives, even when something upstream breaks. |

Security note:

- Confirm project name and operational behavior are safe to publish.

### Project 4: Securing a Shared Search Platform

| Field | Value |
|---|---|
| Name | Securing a Shared Search Platform |
| Role | Project Leader (Developer) |
| Short description | Led the migration of a shared internal search platform from open internal access to strict per-service permissions, where every request must prove who sent it - with zero downtime for the live services using it. |
| Problem solved | The shared search cluster accepted requests from anything inside the network. Every service using it had to start proving its identity and be limited to exactly what it's allowed to do - without interrupting production traffic. |
| Tech stack | AWS IAM, AWS OpenSearch, Python, AWS Firehose, DevOps |

Security note:

- Confirm project name and operational behavior are safe to publish.

### Project 5: At-Risk Teenagers Monitoring System

| Field | Value |
|---|---|
| Name | At-Risk Teenagers Monitoring System |
| Context | Volunteer, Team Leader |
| Role | Team Leader |
| Short description | A web app that helps a non-profit organization track and support at-risk teenage girls with eating disorders, built through volunteer work. |
| Problem solved | The organization struggled to track each teenager's situation and risk level. The system made that work significantly faster and more reliable. |
| Tech stack | Bubble.io, JavaScript, Figma |
| Backend focus | TBD |
| Why important | A 100% volunteer project that solved a real-life problem for hundreds of at-risk teenagers, improving their lives in practice. |

Privacy note:

- Avoid sensitive personal details about teenagers or health/risk conditions beyond generalized language.

### Project 6: Developer Portfolio Website

| Field | Value |
|---|---|
| Name | Developer Portfolio Website |
| Role | Solo Developer |
| Short description | The site you're reading right now - my portfolio and online CV, with a custom dark developer look and subtle scroll animations. |
| Problem solved | I wanted one home for my CV, experience, projects, and courses - built with real engineering care, not from a generic template. |
| Solution | Built from scratch with Next.js. All content lives in typed, validated data files, the UI is a small reusable design system, and every animation respects reduced-motion preferences. |
| Tech stack | Next.js, TypeScript, Tailwind CSS, Framer Motion, shadcn/ui, Vercel, AI Development |
| Why important | As a backend developer, building the entire frontend myself - design, animations, accessibility, performance - pushed me far outside my comfort zone and shows full-stack range. |

### Link to Full Projects Page

Button text:

```text
View All Projects
```

### Layout Behavior

Desktop:

- Featured large project can be displayed prominently.
- Remaining projects can be displayed as cards.
- Cards should emphasize backend problem-solving rather than screenshots.

Mobile:

- Cards should stack vertically.
- The featured card should not become visually overwhelming.
- Tech stack badges should wrap cleanly.

### Acceptance Criteria

- Shows 3–5 top projects.
- Includes all required card fields.
- Includes `View All Projects` link/button.
- Does not expose confidential employer information.
- Project cards are readable without relying on images.
- Cards have accessible links and hover states.
- The section works even if screenshots are not available.

---

## 8.5 Courses Preview Section

### Purpose

The Courses Preview section should show the top 3–5 courses and link to the full Courses Hub page.

This section should highlight learning discipline and professional growth. It should not feel like a random list of courses.

### Number of Courses

The homepage should show 3–5 courses.

The planning template provides 5 courses.

### Layout Preference

Preferred layout:

- Learning path preview

### Required Course Card Fields

Each course card should include:

- Course name
- Provider
- Course image
- Short description
- Skills sharpened
- Category
- Completion date
- Number of hours
- Certificate

### Course Image Behavior

Course image source is not specified.

Status: **TBD**

Expected behavior:

- If a course image is available, display optimized image.
- If no course image is available, use a consistent fallback visual.
- Fallback should not look generic or low effort.
- Certificate provider logos may be used only if licensing permits.

### Course 1: Python Deep Dive

| Field | Value |
|---|---|
| Course name | Python Deep Dive (4 parts) |
| Provider | Udemy |
| Category | Python, Software Development |
| Completion date | Feb 2024 |
| Description | Series of courses diving into the inner mechanics and complicated aspects of Python 3 |
| Skills sharpened | Python Programming |
| Number of hours | 140 |
| Certificate link | `https://drive.google.com/file/d/1IQYFLg_E-U2Yoo5yci96UloToyTasQcZ/view` |
| Image idea/source | TBD |

### Course 2: Fundamentals of Backend Engineering

| Field | Value |
|---|---|
| Course name | Fundamentals of Backend Engineering |
| Provider | Udemy |
| Category | Backend Development |
| Completion date | April 2024 |
| Description | Intermediate-to-advanced backend engineering course covering core client-server communication patterns, transport/application protocols, connection handling, request parsing, and backend execution models. |
| Skills sharpened | Client-server communication, backend optimization, scalability, concurrency, execution models |
| Number of hours | 16 |
| Certificate link | TBD |
| Image idea/source | TBD |

### Course 3: Clean Code

| Field | Value |
|---|---|
| Course name | Clean Code |
| Provider | Udemy |
| Category | Python, Software Development |
| Completion date | May 2024 |
| Description | Clean Code course focused on writing readable, maintainable, and well-structured code through effective naming, formatting, function design, error handling, class cohesion, and SOLID principles. |
| Skills sharpened | Code readability, abstraction, DRY principles, maintainability |
| Number of hours | 16 |
| Certificate link | TBD |
| Image idea/source | TBD |

### Course 4: Coding Agents Hands-on Workshop

| Field | Value |
|---|---|
| Course name | Coding Agents Hands-on Workshop |
| Provider | Anthropic & Check Point |
| Category | Generative AI |
| Completion date | June 2026 |
| Description | Workshop on working effectively with coding agents, focusing on context management, token efficiency, structured development workflows, and automation. |
| Skills sharpened | AI-assisted development, context management, token efficiency, prompt engineering |
| Number of hours | 9 |
| Certificate link | TBD |
| Image idea/source | TBD |

Note:

- Provider is written as “Antrophic” in the planning template. Correct spelling should be confirmed.

### Course 5: Claude Code Beginner Crash Course

| Field | Value |
|---|---|
| Course name | Claude Code Beginner Crash Course |
| Provider | Udemy |
| Category | Generative AI |
| Completion date | Marc 2026 |
| Description | Claude Code crash course focused on building secure, context-aware, and automated AI-assisted development workflows using terminal commands, IDE integration, persistent memory, hooks, and sub-agents. |
| Skills sharpened | Context engineering, AI-assisted development, token efficiency |
| Number of hours | 8.5 |
| Certificate link | TBD |
| Image idea/source | TBD |

Note:

- Completion date appears as “Marc 2026” and should be corrected to **March 2026** if intended.

### Link to Full Courses Page

Button text:

```text
Explore Courses Hub
```

### Acceptance Criteria

- Shows 3–5 top courses.
- Courses feel grouped around professional growth, not random completion.
- Each course card includes required fields where data exists.
- Missing certificate links are shown as unavailable, omitted, or marked TBD in content data.
- Missing images use consistent fallback visuals.
- Includes `Explore Courses Hub` link/button.
- Course cards are responsive and accessible.

---

## 8.6 Technical Skills Section

### Purpose

The Technical Skills section should show Noam’s technical stack quickly and visually.

### Layout Preference

Preferred layout:

- Skill badges
- Animated icons
- Section overview showing skill categories and relative breadth

### Proficiency Display

The planning template does not specify whether proficiency levels should be shown.

Status: **TBD**

Default requirement:

- Do not show numeric proficiency percentages unless explicitly provided.
- Prefer grouping by category and showing notes where useful.

### Skill Categories

#### Programming

| Skill | Notes |
|---|---|
| Python | — |
| SQL | — |
| Bash | — |
| Flask | — |
| Pytest | — |
| Linting (Ruff) | — |

#### Tools & Infrastructure

| Skill | Notes |
|---|---|
| Docker | — |
| Linux | — |
| Jenkins | — |
| GitHub | — |
| Prometheus | — |
| Nagios | — |
| Grafana | — |
| Vulnerability Scanning | — |
| Vercel | — |
| AWS LocalStack | — |

#### Databases

| Skill | Notes |
|---|---|
| DynamoDB | — |
| PostgreSQL | — |
| Redis | — |
| VectorDB (Vespa.ai) | — |
| Elasticsearch | — |
| Parquet | — |
| Apache Iceberg | — |

#### Concepts & Methodologies

| Skill | Notes |
|---|---|
| Computer Networking | — |
| OSI Network Architecture | — |
| REST API Design | — |
| Multi-Threading | — |
| Microservices | — |
| OOP | — |
| Clean Code | — |

#### Cloud

| Skill | Notes |
|---|---|
| AWS ECS | — |
| AWS EC2 | — |
| AWS SQS | — |
| AWS DynamoDB | — |
| AWS ElastiCache | — |
| AWS OpenSearch | — |
| AWS S3 | — |
| AWS CloudFormation | — |
| AWS Kinesis Firehose | — |
| AWS RDS | — |
| AWS Secrets Manager | — |
| AWS API Gateway | — |
| AWS Lambda | — |
| AWS Glue | — |
| AWS Athena | — |
| AWS KMS | — |
| AWS EventBridge | — |
| AWS ECR | — |

#### AI Development

| Skill | Notes |
|---|---|
| Claude Code | — |
| Codex | — |
| GitHub Copilot | — |
| Cursor | — |
| Token Optimization | — |
| Prompt Engineering | — |
| Agent Orchestration | — |

### Icon / Badge Expectations

Skills should be displayed with:

- Text labels
- Optional icons
- Optional category badges
- Accessible labels
- Consistent visual style

Icons must come from a safe, license-compatible source.

### Layout Behavior

Desktop:

- Category cards or grouped rows.
- Skill badges should be scannable.
- Notes may be shown inline or on hover/click, but not hover-only.

Mobile:

- Categories stack vertically.
- Badges wrap naturally.
- Long categories (e.g. Cloud) remain readable.

### Acceptance Criteria

- All listed skill categories are represented.
- Skills are grouped clearly.
- No fake proficiency levels are invented.
- Missing notes are not shown as empty UI artifacts.
- Icons are decorative unless they add meaningful information.
- Section remains readable on mobile.

---

## 8.7 Resume Section

### Purpose

The Resume section should give visitors a quick preview of the resume and allow them to download it.

> **Hero CTA wiring note:** The Hero's primary (Resume) CTA is shipped as a no-op in the MVP (§8.1). When this section is implemented, the Hero Resume button MUST be wired to the chosen resume behavior (scroll to `#resume`, open `/resume.pdf`, or open the modal) and its no-op state removed before launch.

### Required Features

- Embedded resume preview
- Download PDF button

### Resume File

| Field | Value |
|---|---|
| File name | Noam Pony CV.pdf |
| Location in project (repo path) | `/public/resume.pdf` |
| Served URL | `/resume.pdf` |
| Last updated | TBD |
| Download button text | Download CV |

### Resume Preview Behavior

Expected behavior:

- Display a preview of the resume PDF if technically feasible and performant.
- Provide a clear fallback link if embedded preview is not supported.
- The preview should not break mobile layout.
- The preview should not require third-party trackers.

### Download / Open Behavior

Required:

- Provide a `Download CV` button.
- Resume file lives at repo path `/public/resume.pdf` and is served at URL **`/resume.pdf`**.
- Browser should either download or open the PDF depending on final implementation.

Final behavior is **TBD**.

### Resume Highlights

The planning template does not define specific resume highlights.

Status: **TBD**

### Acceptance Criteria

- Resume file is accessible at `/public/resume.pdf`.
- `Download CV` button works.
- Resume preview is readable or has a graceful fallback.
- Last updated date is shown only after it is provided.
- Resume content is reviewed for privacy before publication.
- Resume preview works on desktop and does not create a broken mobile experience.

---

## 8.8 Contact Section

> **Hero CTA wiring note:** The Hero's secondary (Contact) CTA is shipped as a no-op in the MVP (§8.1). When this section is implemented, the Hero Contact button MUST be wired to scroll to `#contact` (or navigate to the Contact page) and its no-op state removed before launch.

### Purpose

The Contact section should make it easy to contact Noam professionally.

### Required Contact Options

- Email
- LinkedIn
- Phone
- Location

### Contact Content

| Field | Value |
|---|---|
| Heading | Get In Touch |
| Short message | Lets Work Together! Have something interesting to work on? Feel free to contact me. |
| Email | `noampony2@gmail.com` |
| LinkedIn | `https://www.linkedin.com/in/noam-pony/` |
| Phone | `+972 50 4377257` |
| Location | Israel |
| Preferred contact method | Phone |

Recommended text correction:

```text
Let's Work Together! Have something interesting to work on? Feel free to contact me.
```

### Contact Form Decision

The planning template says:

```text
Do I want a contact form? Yes
```

But contact form is also listed as nice-to-have in MVP scope.

Decision:

- Contact form is **nice-to-have** unless promoted to must-have later.
- Direct contact links must be implemented before the contact form.

### Contact Form Fields

If implemented, the form should include:

- Name
- Email
- Message

### Contact Form Behavior

Form backend/provider is **TBD**.

Required if implemented:

- Validate required fields.
- Validate email format.
- Protect against spam.
- Avoid exposing secrets in client-side code.
- Provide success and error states.
- Do not send messages without user confirmation.
- Do not store unnecessary personal data.

### Acceptance Criteria

- Contact section displays heading, message, email, LinkedIn, phone, location, and preferred contact method.
- Email link uses `mailto:`.
- Phone link uses `tel:`.
- LinkedIn link opens safely in a new tab.
- Contact form is omitted or clearly implemented as production-ready; no broken placeholder form.
- Contact data is readable and accessible on mobile.

---

## 8.9 Floating Business Card

### Purpose

The Floating Business Card is an interactive card that opens from the side and shows quick contact/profile information.

### MVP Status

The planning template lists Floating Business Card under homepage sections but leaves it unchecked in MVP Must Have.

Status: **Nice-to-have unless promoted later**

### Trigger Behavior

Required behavior if implemented:

- Always visible as a floating button.
- Opens on click.
- Opens from the left side.
- Closes on outside click.
- Mobile-friendly drawer.

### Open / Close Behavior

The card must close when:

- User clicks outside the drawer.
- User presses Escape.
- User clicks a close button.
- User selects an action if appropriate.

### Desktop Behavior

Desktop behavior:

- Floating trigger remains visible.
- Drawer opens from the left.
- Drawer width should not dominate the screen.
- Page content may remain visible behind it.
- Background overlay may be used if needed.

### Mobile Behavior

Mobile behavior:

- Acts as a drawer or bottom sheet.
- Does not cover content without clear close behavior.
- Touch targets are large enough.
- Focus and scroll behavior are controlled.

### Required Business Card Content

| Field | Value |
|---|---|
| Name | Noam Pony |
| Title | Backend Developer |
| Short tagline | TBD |
| Email | `noampony2@gmail.com` |
| LinkedIn | `https://www.linkedin.com/in/noam-pony/` |
| Resume link | TBD |
| Profile picture | TBD |
| Location | Israel |

### Visual Style

Preferred style:

- Glassmorphism
- Terminal-style card

### Accessibility Requirements

The Floating Business Card must:

- Be keyboard accessible.
- Have an accessible trigger label.
- Use dialog/drawer semantics where appropriate.
- Trap focus while open if modal behavior is used.
- Restore focus to the trigger on close.
- Support Escape key close.
- Avoid hover-only interaction.

### Acceptance Criteria

- Floating trigger is visible without blocking core CTAs.
- Card opens from the left on desktop.
- Card behaves as a mobile-friendly drawer on mobile.
- Required contact fields are displayed.
- Missing fields are omitted or marked TBD in data, not shown as broken UI.
- Card is accessible by keyboard and screen reader.
- Card does not interfere with page scrolling or navigation.

---

## 8.10 Terminal Popup / Easter Egg

### MVP Status

The Terminal Popup is explicitly not part of the initial implementation.

Status: **Nice-to-have**

The planning template states:

```text
Will not be implemented now, only after the whole website is done.
```

### Purpose

An interactive terminal-like component where visitors can type commands to learn about Noam.

### Trigger Behavior

The terminal should open from:

- Floating terminal button

### Supported Commands

| Command | Expected Output |
|---|---|
| `help` | Show available commands |
| `whoami` | Brief info about Noam |
| `skills` | Brief overview of technical skills |
| `projects` | Show top projects |
| `courses` | Show learning summary |
| `experience` | Show short professional experience |
| `contact` | Show contact links |
| `resume` | Show resume download link |
| `clear` | Clear terminal |
| `easteregg` | Fun hidden message |
| Other | TBD |

### Example Outputs

The following command outputs are currently missing and must remain TBD until written:

| Command | Output Status |
|---|---|
| `whoami` | TBD |
| `skills` | TBD |
| `projects` | TBD |
| `courses` | TBD |
| `easteregg` | TBD |

### Terminal Design

The terminal should use:

- Dark terminal window
- Minimal developer console style
- Typing animation if motion settings allow it

### Accessibility Requirements

The terminal must:

- Be keyboard accessible.
- Provide visible focus states.
- Announce output changes appropriately where feasible.
- Support Escape key close if displayed as modal.
- Provide `help`.
- Provide `clear`.
- Avoid trapping users.
- Respect reduced motion.

### Acceptance Criteria

- Terminal is not implemented before the core website is complete.
- Terminal opens from a floating terminal button.
- All supported commands return deterministic predefined output.
- Unknown commands return a helpful message.
- `help` lists available commands.
- `clear` clears visible terminal history.
- `resume` provides a safe resume link.
- Terminal can be closed using keyboard and pointer.
- Reduced-motion mode disables or minimizes typing animations.

---

## 9. Full Projects Page Specification

### 9.1 Purpose

The Projects page should show all projects in depth.

Implementation depends on the number of projects available. The planning template states that if there are fewer than 10 projects, this page may not be necessary.

### 9.2 MVP Status

Status: **Conditional / nice-to-have**

This page should not block the Hero MVP.

### 9.3 Page Layout

Recommended layout:

- Page heading and short intro
- Featured projects area
- Filter/search controls
- Project grid or list
- Optional project detail pages or expandable details

Final layout is **TBD**.

### 9.4 Search / Filter Requirements

Planned filters:

- Quick filter by technology
- Quick filter by category

Search is not explicitly required but may be useful.

Search requirement status: **TBD**

### 9.5 Project Categories

Allowed project categories:

- Backend
- DevOps
- Cloud
- Web
- Learning project

### 9.6 Project Detail Fields

Each detailed project should support:

| Field | Required | Description |
|---|---:|---|
| Project name | Yes | Public-safe project name |
| Year | Yes | Year or date range |
| Category | Yes | One or more project categories |
| Short description | Yes | Concise summary |
| Problem | Yes | Problem the project solved |
| Solution | Yes | High-level solution |
| Tech stack | Yes | Public-safe technologies used |
| Backend architecture | Optional | High-level architecture, no confidential detail |
| Database | Optional | Database or storage technologies |
| Security considerations | Optional | Public-safe security considerations |
| Challenges | Optional | Technical or delivery challenges |
| Live demo link | Optional | External link if available |
| Screenshots / images | Optional | Only if safe and approved |

### 9.7 Project Card Behavior

Project cards should:

- Show project name, category, short description, tech stack, and backend focus.
- Avoid requiring screenshots.
- Emphasize backend complexity and problem-solving.
- Provide a way to view more details if detail pages or expandable cards exist.
- Indicate unavailable links gracefully.

### 9.8 Project Detail Behavior

Project details may be implemented as:

- Dedicated detail pages
- Expandable cards
- Modal dialogs
- Static sections within the Projects page

Final behavior is **TBD**.

### 9.9 GitHub / Live Links Behavior

GitHub and live links are optional.

Rules:

- Do not link internal repositories.
- Do not link private repositories.
- Do not show broken links.
- External links must open safely.
- Live demo links are optional.

### 9.10 Security / Confidentiality Constraints

The Projects page must not include:

- Internal company project names unless explicitly approved
- Internal architecture details
- Customer data
- Internal repositories
- Internal metrics unless approved
- IP addresses
- Domains
- Hostnames
- Logs
- Screenshots from work systems
- Sensitive cybersecurity workflows
- Proprietary implementation details

### 9.11 Acceptance Criteria

- Projects page is implemented only if enough projects justify it or if explicitly required later.
- Page shows a structured list/grid of projects.
- Filters by technology and category work if implemented.
- Project details use the defined content model.
- No confidential employer information is exposed.
- Optional links are displayed only when valid.
- Page is responsive and accessible.
- Page can handle projects without screenshots.

---

## 10. Full Courses Hub Page Specification

### 10.1 Purpose

The Courses Hub should show all completed courses in a structured, attractive way.

It should communicate learning discipline, professional growth, and skill development.

### 10.2 MVP Status

Status: **Conditional / nice-to-have for full page**

Courses Preview on the homepage is must-have after the Hero MVP.

### 10.3 Page Layout

Recommended layout:

- Page heading and intro
- Total completed courses stat
- Category breakdown
- Featured courses
- Learning paths section
- Filter controls
- Course cards grid/list

Final layout is **TBD**.

### 10.4 Search / Filter Requirements

Planned filters:

- Quick filter by category
- Quick filter by skills sharpened

Search is not explicitly required.

Search requirement status: **TBD**

### 10.5 Course Categories

Allowed course categories:

- Backend Development
- Python
- AWS
- Docker
- DevOps
- CI/CD
- Cybersecurity
- Databases
- Testing
- System Design
- Leadership
- Productivity
- Generative AI

### 10.6 Course Card Fields

Each course card should support:

| Field | Required | Description |
|---|---:|---|
| Course name | Yes | Course title |
| Provider | Yes | Course provider |
| Category | Yes | One or more course categories |
| Completion date | Yes | Month/year or exact date |
| Certificate PDF file | Optional | Local or external certificate |
| Certificate link | Optional | External certificate URL |
| Course image | Optional | Course image or fallback |
| Short description | Yes | Concise course summary |
| Skills sharpened | Yes | Skills improved by course |
| Main topics | Optional | Topics covered |
| Why I took it | Optional | Motivation |
| What I learned | Optional | Learning outcome |
| Related projects | Optional | Linked project references |
| Number of hours | Optional | Course duration |

### 10.7 Learning Paths

Learning paths should group courses by professional theme.

Planned learning paths:

#### Backend Engineering Path

Courses to include:

- TBD

#### Cloud & DevOps Path

Courses to include:

- TBD

#### Security-Aware Developer Path

Courses to include:

- TBD

#### Leadership / Productivity Path

Courses to include:

- TBD

### 10.8 Stats / Summary Requirements

The Courses Hub should include:

- Total completed courses stat
- Category breakdown
- Optional total hours
- Optional featured courses
- Optional learning path progress

Known certificate/course stats:

- Courses completed: **35**
- Certificates: a **subset of the 35** — not every course has a PDF certificate. Exact certificate count is **TBD** (count only courses that have a certificate).
- Top course hours provided for selected courses

Total hours is **TBD**. (Supersedes the earlier "40 certificates" / "over 30 courses" figures.)

### 10.9 Certificate Link Behavior

Certificate behavior:

- External certificate links open safely in a new tab.
- Missing certificates are omitted or shown as unavailable.
- Certificate PDFs may be stored locally if provided.
- Private Google Drive links must be tested for public access before publication.
- No certificate link should expose private directories or account information.

### 10.10 Acceptance Criteria

- Courses Hub displays courses in a structured, attractive way.
- Courses can be filtered by category and skills sharpened if filters are implemented.
- Learning paths are displayed only when course membership is defined.
- Certificates link correctly or are omitted.
- Missing course images use consistent fallback visuals.
- Page is responsive and accessible.
- The page reinforces learning discipline and professional growth.

---

## 11. Content Model

The following models are implementation-neutral. They may later be represented as TypeScript, JSON, MDX, or transformed Notion data.

## 11.1 Profile Model

| Field | Type | Required | Description | Example |
|---|---|---:|---|---|
| `name` | String | Yes | Full display name | `Noam Pony` |
| `title` | String | Yes | Professional title | `Backend Developer` |
| `shortTagline` | String | Optional | Short tagline | TBD |
| `oneLineSummary` | String | Yes | Short summary | `A passionate, experienced cloud backend developer` |
| `heroText` | String | Yes | Hero text block | `A passionate, experienced cloud backend developer. Building scalable & reliable cloud backend systems.` |
| `location` | String | Yes | Public location (owner prefers `Israel` everywhere) | `Israel` |
| `city` | String | Optional | More specific location — **not used**; owner prefers showing `Israel` only | unused |
| `profileImage` | Asset reference | Optional | Profile image path/source | TBD |
| `logo` | Asset reference | Optional | Personal logo path/source | TBD |
| `yearsExperienceStartDate` | Date | Yes | Start date for dynamic experience calculation | `2022-10` |
| `projectsCountLabel` | String | Optional | Display count — omit until the real count is known; do not hardcode `10+` | TBD |
| `technologiesCountLabel` | String | Yes | Display count | `18+` |
| `coursesCountLabel` | String | Yes | Display count of completed courses | `35` |
| `certificatesCountLabel` | String | Optional | Display count of courses that have a certificate (subset of courses) — omit until counted | TBD |
| `mainFields` | List of strings | Optional | Main professional fields if reused outside the removed About Me section | `Python`, `AWS`, `Docker` |

## 11.1A Impact Model

| Field | Type | Required | Description | Example |
|---|---|---:|---|---|
| `title` | String | Yes | Impact card title | `Team Knowledge Base` |
| `description` | String | Yes | Concise public-safe impact summary | `Built a central hub for services, guides, templates, and engineering knowledge.` |
| `impactBullets` | List of strings | Yes | Concrete outcomes created by the work | `Faster knowledge sharing across the team` |
| `icon` | Asset/Icon reference | Optional | Decorative or meaningful icon shown on the card | TBD |
| `displayOrder` | Number | Yes | Carousel ordering | `1` |
| `confidentialityReviewed` | Boolean | Yes | Whether content has been reviewed for public sharing | `false` initially |

## 11.2 Experience Model

| Field | Type | Required | Description | Example |
|---|---|---:|---|---|
| `organization` | String | Yes | Company or organization name | `Check Point Software Technologies` |
| `organizationType` | String | Optional | Company, non-profit, self-employed, etc. | `Non-Profit Association` |
| `role` | String | Yes | Role title | `Cloud Backend Software Developer` |
| `employmentType` | String | Optional | Full-time, volunteer, self-employed | `Volunteer` |
| `startDate` | Date | Yes | Start date | `2022-10` |
| `endDate` | Date or `Present` | Optional | End date | `Present` |
| `durationLabel` | String | Optional | Human-readable duration | `1 year, 1 month` |
| `description` | String | Yes | Public-safe description | See Experience section |
| `technologies` | List of strings | Optional | Technologies used | `Python`, `AWS`, `DynamoDB` |
| `teamSize` | String | Optional | Team size when relevant | `3–5 volunteer developers` |
| `link` | URL | Optional | Public link | LinkedIn post URL |
| `screenshots` | List of assets | Optional | Public-safe screenshots | TBD |
| `confidentialityReviewed` | Boolean | Yes | Whether content has been reviewed for public sharing | `false` initially |

## 11.3 Project Model

| Field | Type | Required | Description | Example |
|---|---|---:|---|---|
| `name` | String | Yes | Project name | `Microsoft & Google Event Streaming` |
| `role` | String | Yes | Noam’s role | `Project Leader` |
| `year` | String or Number | Optional | Project year | TBD |
| `category` | List of strings | Yes | Project categories | `Backend`, `Cloud` |
| `shortDescription` | String | Yes | Concise project summary | See Projects section |
| `problemSolved` | String | Yes | Problem solved | `The product needs to know what's happening inside customers' Microsoft and Google accounts...` |
| `solution` | String | Optional | High-level solution | TBD |
| `techStack` | List of strings | Yes | Public-safe technologies | `AWS`, `Python`, `Docker` |
| `backendFocus` | String | Yes | Backend relevance | `A high-scale pipeline handling billions of events weekly` |
| `whyImportant` | String | Optional | Business/product/user impact | See Projects section |
| `architecture` | String | Optional | Public-safe architecture notes | TBD |
| `database` | List of strings | Optional | Database/storage technologies | `DynamoDB`, `Athena` |
| `securityConsiderations` | String | Optional | Public-safe security notes | TBD |
| `challenges` | String | Optional | Technical challenges | TBD |
| `githubUrl` | URL | Optional | Public GitHub URL | TBD |
| `liveDemoUrl` | URL | Optional | Public live demo URL | TBD |
| `screenshots` | List of assets | Optional | Public-safe images | TBD |
| `isFeatured` | Boolean | Optional | Whether shown as featured | `true` |
| `confidentialityReviewed` | Boolean | Yes | Whether safe for publication | `false` initially |

## 11.4 Course Model

| Field | Type | Required | Description | Example |
|---|---|---:|---|---|
| `name` | String | Yes | Course name | `Python Deep Dive (4 parts)` |
| `provider` | String | Yes | Course provider | `Udemy` |
| `category` | List of strings | Yes | Course categories | `Python`, `Software Development` |
| `completionDate` | String or Date | Yes | Completion date | `Feb 2024` |
| `description` | String | Yes | Course summary | See Courses section |
| `skillsSharpened` | List of strings | Yes | Skills improved | `Python Programming` |
| `numberOfHours` | Number | Optional | Course duration | `140` |
| `certificateLink` | URL | Optional | External certificate link | Google Drive certificate link |
| `certificatePdfFile` | Asset reference | Optional | Local certificate file | TBD |
| `courseImage` | Asset reference | Optional | Course image | TBD |
| `mainTopics` | List of strings | Optional | Main topics | TBD |
| `whyITookIt` | String | Optional | Motivation | TBD |
| `whatILearned` | String | Optional | Outcome | TBD |
| `relatedProjects` | List of project references | Optional | Related project IDs | TBD |
| `isFeatured` | Boolean | Optional | Whether shown in preview | `true` |

## 11.5 Skill Model

| Field | Type | Required | Description | Example |
|---|---|---:|---|---|
| `name` | String | Yes | Skill name | `Python` |
| `category` | String | Yes | Skill category | `Programming` |
| `notes` | String | Optional | Additional detail | `Including Jenkinsfile creation` |
| `icon` | Asset/Icon reference | Optional | Skill icon | TBD |
| `proficiency` | String | Optional | Proficiency level if later defined | TBD |
| `displayOrder` | Number | Optional | Sorting order | TBD |

## 11.6 Resume Model

| Field | Type | Required | Description | Example |
|---|---|---:|---|---|
| `fileName` | String | Yes | Original resume filename | `Noam Pony CV.pdf` |
| `repoPath` | String | Yes | Filesystem path in repo | `/public/resume.pdf` |
| `publicUrl` | String | Yes | Served URL used in links | `/resume.pdf` |
| `lastUpdated` | Date | Optional | Last updated date | TBD |
| `downloadButtonText` | String | Yes | Download CTA label | `Download CV` |
| `previewEnabled` | Boolean | Yes | Whether preview is enabled | `true` |
| `highlights` | List of strings | Optional | Resume highlights | TBD |

## 11.7 Contact Model

| Field | Type | Required | Description | Example |
|---|---|---:|---|---|
| `heading` | String | Yes | Contact section heading | `Get In Touch` |
| `message` | String | Yes | Contact intro message | `Let's Work Together!...` |
| `email` | Email string | Yes | Contact email | `noampony2@gmail.com` |
| `linkedIn` | URL | Yes | LinkedIn URL | `https://www.linkedin.com/in/noam-pony/` |
| `phone` | String | Yes | Phone number | `+972 50 4377257` |
| `location` | String | Yes | Public location | `Israel` |
| `preferredContactMethod` | String | Yes | Preferred method | `Phone` |
| `contactFormEnabled` | Boolean | Yes | Whether contact form is enabled | `false` for initial implementation unless promoted |

## 11.8 Social Link Model

| Field | Type | Required | Description | Example |
|---|---|---:|---|---|
| `label` | String | Yes | Display/accessibility label | `LinkedIn` |
| `url` | URL | Yes | External URL | `https://www.linkedin.com/in/noam-pony/` |
| `icon` | Icon reference | Optional | Icon asset | TBD |
| `openInNewTab` | Boolean | Yes | Whether to open externally | `true` |

## 11.9 Terminal Command Model

| Field | Type | Required | Description | Example |
|---|---|---:|---|---|
| `command` | String | Yes | Command text | `whoami` |
| `description` | String | Yes | Description shown in help | `Brief info about me` |
| `output` | String | Yes | Deterministic output | TBD |
| `aliases` | List of strings | Optional | Optional aliases | TBD |
| `isHidden` | Boolean | Optional | Whether hidden from help | `true` for some easter eggs |
| `requiresLink` | Boolean | Optional | Whether command outputs a link | `true` for `resume` |

---

## 12. Technical Architecture Requirements

### 12.1 Planned Stack

The project should be suitable for implementation using the technical preferences from the planning template.

| Area | Tool |
|---|---|
| Framework | Next.js |
| Language | TypeScript |
| Styling | Tailwind CSS / CSS Modules |
| Animations | Framer Motion |
| Components | shadcn/ui |
| Deployment | Vercel |
| Data format | TypeScript / JSON / MDX |
| Package manager | pnpm |

### 12.2 Content Architecture

Content should be data-driven.

Supported content sources:

- JSON files
- TypeScript data files
- MDX where useful
- Notion export transformed into JSON

### 12.3 Rendering Architecture

Expected rendering approach:

- Prefer static generation where possible.
- Keep content local or statically generated for performance and reliability.
- Avoid runtime dependencies on Notion for the public site unless explicitly added later.
- Use structured data files for projects, courses, skills, experience, and profile content.

### 12.4 Component Architecture Expectations

Implementation should support reusable components for:

- Section layout
- CTA buttons
- Cards
- Impact cards
- My Impact carousel
- Timeline entries
- Project cards
- Course cards
- Skill badges
- Resume preview
- Contact methods
- Floating drawer/card
- Terminal popup if later implemented

### 12.5 Data Validation

Content data should be validated before rendering where feasible.

Requirements:

- Missing required fields should fail during development or build.
- Optional fields should be omitted cleanly if absent.
- Broken links should be easy to detect.
- Public/confidential review flags should be supported for projects and experience items.

### 12.6 Deployment

Deployment target:

- Vercel

Acceptance criteria:

- Project can be built and deployed to Vercel.
- Static assets such as resume and images resolve correctly.
- Environment variables are not required for the static MVP unless contact form or analytics are added later.

---

## 13. SEO Requirements

### 13.1 Page Titles

Each page should have a clear title.

Recommended page titles:

| Page | Title |
|---|---|
| Home | `Noam Pony | Backend Developer` |
| Projects | `Projects | Noam Pony` |
| Courses | `Courses | Noam Pony` |
| Resume | `Resume | Noam Pony` |

### 13.2 Meta Descriptions

Each page should include a concise meta description.

Recommended homepage meta description:

```text
Noam Pony is a backend developer focused on cloud backend systems, Python, AWS, automation, DevOps, and security-aware software engineering.
```

Other page descriptions are **TBD**.

### 13.3 Open Graph

The site should include Open Graph metadata for social sharing.

Required:

- `og:title`
- `og:description`
- `og:type`
- `og:url`
- `og:image`

Open Graph image is **TBD**.

### 13.4 LinkedIn / Social Preview

The site should support clean LinkedIn previews.

Requirements:

- Open Graph title renders correctly.
- Description is professional.
- Preview image is polished and not generic.
- URL is canonical.

### 13.5 Sitemap

The site should provide a sitemap.

Required pages if implemented:

- Home
- Projects
- Courses
- Resume, if implemented as a page

### 13.6 robots.txt

The site should include `robots.txt`.

Default behavior:

- Allow indexing of public pages.
- Do not expose private or draft routes.

### 13.7 Structured Data

Structured data is required by the planning template.

Recommended structured data:

- `Person`
- `WebSite`
- Optional `ProfilePage`
- Optional `Course` entries if Courses page is implemented
- Optional `CreativeWork` or `SoftwareSourceCode` for public projects if appropriate

Final structured data details are **TBD**.

### 13.8 Canonical URLs

Canonical URLs should be used for each public page.

Final production domain is **TBD**.

---

## 14. Performance Requirements

### 14.1 Initial Load

The site should have a fast initial load.

Requirements:

- Hero content should render quickly.
- Avoid loading non-critical sections before needed.
- Avoid blocking JavaScript for decorative animations.
- Avoid large images in the initial viewport unless optimized.

### 14.2 Static Generation

Use static generation where possible.

Expected static content:

- Profile
- Experience
- Projects
- Courses
- Skills
- Resume metadata
- Contact information

### 14.3 Optimized Images

Images must be optimized.

Requirements:

- Use responsive image sizes.
- Use modern formats where appropriate.
- Include width and height to avoid layout shift.
- Lazy-load non-critical images.
- Do not lazy-load critical Hero image unless it harms LCP.

### 14.4 Lazy Loading

Lazy-load:

- Courses preview images
- Project images
- Resume preview component if heavy
- Terminal popup
- Floating business card content if appropriate
- Non-critical animation-heavy components

### 14.5 Heavy Libraries

Avoid unnecessary heavy libraries.

Specific guidance:

- Framer Motion is planned but should be used intentionally.
- Do not add large animation or PDF libraries unless needed.
- Avoid client-heavy code for static content.
- Prefer CSS transitions where sufficient.

### 14.6 Lighthouse Targets

Specific Lighthouse targets are not provided.

Recommended targets:

| Category | Target |
|---|---:|
| Performance | 90+ |
| Accessibility | 95+ |
| Best Practices | 95+ |
| SEO | 95+ |

These are recommended targets, not planning-template-provided hard requirements.

### 14.7 Bundle-Size Awareness

Requirements:

- Keep homepage JavaScript minimal.
- Split optional components.
- Do not ship terminal popup code before needed if possible.
- Do not ship contact form provider code if form is not implemented.
- Use tree-shakeable imports.

### 14.8 Animation Performance

Requirements:

- Prefer transform and opacity animations.
- Avoid animating layout-heavy properties.
- Avoid scroll-linked animation that causes jank.
- Respect reduced-motion settings.
- Avoid infinite animations that drain battery or distract users.

---

## 15. Security and Privacy Requirements

### 15.1 Public Sharing Rules

The planning template leaves “Information I Can Publicly Share” blank.

Status: **TBD**

Until finalized, all work-related content must be treated conservatively.

### 15.2 Information That Must Not Be Shared

The website must avoid sharing:

- Internal company project names
- Internal architecture details
- Customer data
- Internal repositories
- Internal metrics
- IP addresses
- Domains
- Hostnames
- Logs
- Screenshots from work systems
- Sensitive cybersecurity workflows
- Sensitive internal implementation details

### 15.3 Employer Wording

The planning template allows describing the current workplace using the company name explicitly.

Allowed:

```text
Check Point Software Technologies
```

### 15.4 Project Confidentiality

Before publication, each work-related project must be reviewed for:

- Public-safe name
- Public-safe description
- Public-safe architecture details
- Public-safe scale metrics
- Public-safe technology list
- Absence of customer identifiers
- Absence of internal terminology

### 15.5 Resume Privacy

Resume must be reviewed before publication.

Review for:

- Personal address
- Excessive phone/email exposure if not intended
- Internal project names
- Confidential metrics
- Customer names
- Internal systems
- Sensitive cybersecurity details

### 15.6 Contact Information Privacy

The site includes:

- Email
- LinkedIn
- Phone
- Location

Privacy decision:

- Phone is explicitly included and marked as preferred contact method.
- Publishing phone number may increase spam risk.
- This is acceptable only if intentionally confirmed before launch.

### 15.7 Contact Form Security

If contact form is implemented:

- Do not expose secrets in frontend code.
- Use server-side validation.
- Validate email format.
- Limit message length.
- Add spam protection.
- Avoid storing unnecessary personal data.
- Provide clear error handling.
- Protect against injection in any rendered output.
- Avoid sending emails directly from the client.
- Do not log sensitive message content unnecessarily.

### 15.8 External Links

External links must:

- Open in a new tab where appropriate.
- Use `rel="noopener noreferrer"` for new tabs.
- Have accessible labels.
- Be checked for validity.
- Avoid linking private or inaccessible resources.

### 15.9 Asset Security

The site must not include:

- Secrets
- `.env` files
- Internal config files
- Private certificates
- Internal screenshots
- Access tokens
- API keys
- Private repository URLs

---

## 16. Responsive Design Requirements

### 16.1 Desktop

Desktop layout should:

- Use a polished wide layout.
- Support side-by-side Hero content and visual.
- Use card grids where appropriate.
- Support timeline layout for Experience.
- Display resume preview if feasible.
- Keep navbar sticky and readable.

### 16.2 Tablet

Tablet layout should:

- Reduce grid columns appropriately.
- Preserve section hierarchy.
- Avoid cramped card layouts.
- Keep CTAs large enough for touch.
- Maintain readable line lengths.

### 16.3 Mobile

Mobile layout should:

- Stack content vertically.
- Keep primary CTAs visible and tappable.
- Collapse navbar into mobile navigation.
- Avoid oversized profile image.
- Hide or reduce decorative floating code blocks if they reduce clarity.
- Keep cards readable without horizontal scrolling.
- Avoid heavy resume embeds that break layout.

### 16.4 Navigation Behavior

Responsive navigation must:

- Use desktop navbar on larger screens.
- Use mobile menu on small screens.
- Support keyboard navigation.
- Have clear close behavior.
- Avoid covering content permanently.

### 16.5 Business Card Behavior

Desktop:

- Floating button opens left-side drawer.

Mobile:

- Floating button opens mobile-friendly drawer or sheet.
- Drawer must be easy to close.
- Drawer must not permanently block navigation.

### 16.6 Terminal Popup Behavior

Desktop:

- May appear as modal, floating window, or drawer.
- Should be resizable only if intentionally implemented.

Mobile:

- Should be simplified.
- Must not require complex keyboard interaction that breaks mobile usability.
- Should not be implemented until core site is complete.

### 16.7 Card Grids

Card grids must:

- Use multiple columns on desktop.
- Reduce to fewer columns on tablet.
- Stack on mobile.
- Maintain consistent spacing.
- Avoid horizontal overflow.

### 16.8 Resume Preview

Desktop:

- Embedded preview is acceptable if performant.

Mobile:

- Preview may be replaced by a simple open/download CTA if embedding is poor.
- Download button must remain available.

---

## 17. Content Source Mapping

| Content Area | Expected Source | Status |
|---|---|---|
| Resume | File uploaded by Noam | File expected at `/public/resume.pdf`; actual file TBD |
| Projects | Noam-provided data | 6 projects provided; full list TBD |
| Courses | Notion Courses Hub | Top 5 provided; full hub TBD |
| Profile picture | File provided by Noam | TBD |
| Certificates | Notion Courses Hub and files provided by Noam | Mostly TBD |
| LinkedIn | Public LinkedIn URL | Provided |
| GitHub | Public GitHub source/profile | TBD |
| Icons | Internet/icon library | Exact source TBD; must be license-safe |
| Profile/logo visual | File provided by Noam | TBD |
| Open Graph image | Designed asset | TBD |
| Course images | Course image source or fallback | TBD |
| Project images/screenshots | Public-safe images only | TBD |
| Resume last updated date | Resume metadata/manual input | TBD |
| Terminal command outputs | Manually written content | TBD |
| Learning paths | Course grouping from Courses Hub | TBD |
| Contact details | Planning template | Provided |
| Inspiration references | Planning template | Provided |

---

## 18. Acceptance Criteria Summary

### 18.1 MVP Acceptance Criteria

The MVP is complete when the Hero section:

- Displays Noam Pony as the name.
- Displays Backend Developer as the title.
- Displays the required Hero text.
- Displays location.
- Renders Resume and Contact CTA buttons as no-op placeholders (styled, focusable, no broken links); final behavior deferred to §8.7/§8.8.
- Includes LinkedIn link.
- Includes profile image/logo or approved placeholder visual.
- Includes polished backend/developer visual direction.
- Is responsive on desktop, tablet, and mobile.
- Has accessible headings, buttons, links, and contrast.
- Respects reduced motion.
- Does not include broken links.
- Does not include unfinished placeholder UI.
- Can be deployed to Vercel.

### 18.2 Global Acceptance Criteria for Full Planned Website

The finished planned website is complete when:

- Home page contains all planned core sections.
- Each section is fully implemented before moving to the next.
- Projects Preview shows 3–5 projects.
- Courses Preview shows 3–5 courses.
- Resume preview/download works.
- Contact section includes direct contact methods.
- Technical skills are grouped and scannable.
- My Impact carousel clearly shows selected career impacts.
- Experience timeline clearly shows professional and leadership experience.
- Responsive design works across desktop, tablet, and mobile.
- Basic animations, including the My Impact carousel, are polished and non-disruptive.
- Reduced-motion preferences are respected.
- SEO metadata is implemented.
- Sitemap and robots.txt exist.
- Open Graph and LinkedIn previews are supported.
- Images are optimized.
- Static generation is used where possible.
- No confidential employer data is exposed.
- External links are safe.
- Contact form is either omitted or production-ready.
- Optional features are not shipped as broken placeholders.

---

## 19. Open Questions / TBDs

### 19.1 Product Scope TBDs

- Should the Floating Business Card be promoted from nice-to-have to must-have?
- Should the Terminal Popup be included at all after the core website is complete?
- Should the Projects page be implemented if fewer than 10 projects are available?
- Should the Courses page be implemented immediately after homepage completion or later?
- Should Blog be considered in future scope?

### 19.2 Hero TBDs

- What is the final short tagline?
- What should the primary CTA label be?
- Should the primary CTA open a Resume page, Resume section, modal, or direct PDF?
- What should the secondary CTA label be?
- Should the secondary CTA navigate to a Contact section or separate Contact page?
- What profile image or logo should be used?
- What exact animated Python code snippets should appear in the background?

### 19.3 Visual Design TBDs

- What exact color palette should be used?
- What fonts should be used?
- What accent color should represent the brand?
- Should light mode be implemented later?
- What exact icon source/library should be used?
- What should the Open Graph preview image look like?

### 19.4 My Impact TBDs

- Are the impact card titles and descriptions final for publication?
- Should the My Impact carousel use React Bits Pro Circle Gallery or an equivalent React Bits-compatible implementation?
- Should card icons use emoji, a licensed icon library, or custom icons?
- Should the auto-advance pause on keyboard focus as well as mouse hover?

### 19.5 Experience TBDs

- What was the exact role title for the Dec 2021 – Oct 2022 Check Point experience?
- What are the dates for the Private Tutor experience?
- Are the listed project-scale metrics approved for public sharing?
- Are optional screenshots allowed for any experience?
- Should the experience descriptions be shortened for public display?

### 19.6 Projects TBDs

- Are the work project names safe to publish?
- Are the described internal behaviors safe to publish?
- Is “2 billion events per week” safe to publish?
- Should project detail pages, modals, or expandable cards be used?
- What are the years for each project?
- What are the final project categories?
- Are there GitHub links for any project?
- Are there live demo links for any project?
- Are screenshots/images available and safe?
- What is the Backend focus for the At-Risk Teenagers Monitoring System?
- How many total projects will be available for the Projects page?

### 19.7 Courses TBDs

- What is the full Courses Hub source data?
- What are the exact learning path groupings?
- Should course filters be included in the first Courses page version?
- Should search be included?
- What course images should be used?
- Are certificate links public and stable?
- Should missing certificates be hidden or shown as unavailable?
- Is the provider for “Coding Agents Hands-on Workshop” “Anthropic & Check Point”?
- Should “Marc 2026” be corrected to “March 2026”?
- What are the total course count and total hours?

### 19.8 Resume TBDs

- What is the actual resume file?
- What is the resume last updated date?
- Should Resume be a dedicated page, modal, section, or direct PDF?
- Should resume highlights be displayed?
- Has the resume been reviewed for privacy and confidentiality?

### 19.9 Contact TBDs

- Should the phone number remain publicly visible?
- Should the contact form be implemented despite being listed as nice-to-have?
- What backend/provider should power the contact form?
- Should spam protection be included from the first contact form version?
- Should preferred contact method be visually emphasized?

### 19.10 Floating Business Card TBDs

- What short tagline should appear on the card?
- What resume link should the card use?
- What profile picture should the card use?
- Should the visual style lean more glassmorphism or terminal-style?
- Should the card be implemented before or after Projects/Courses pages?

### 19.11 Terminal TBDs

- What should `whoami` output?
- What should `skills` output?
- What should `projects` output?
- What should `courses` output?
- What should `experience` output?
- What should `contact` output?
- What should `resume` output?
- What should `easteregg` output?
- Should unknown commands show suggestions?
- Should terminal history persist during a session?

### 19.12 SEO TBDs

- What is the production domain?
- What is the final Open Graph image?
- What are the final meta descriptions for Projects, Courses, and Resume pages?
- What structured data should be included beyond `Person` and `WebSite`?

### 19.13 Analytics / Privacy TBDs

- Should analytics be implemented?
- If analytics are implemented, which privacy-respecting provider should be used?
- Should cookie consent be needed?
- What data, if any, should be collected?

### 19.14 Source / Asset TBDs

- What is the GitHub profile URL?
- What profile image file should be used?
- What certificate files should be included locally?
- What icons are license-safe?
- What images are safe for backend projects without exposing internal systems?

---

## 20. Accessibility Baseline (Basic)

This is the **basic, must-have** accessibility set for every shipped page. It is intentionally minimal — not a full WCAG audit. Target conformance is **WCAG 2.1 AA**.

1. **Semantic structure** — use real landmarks (`header`, `nav`, `main`, `footer`, `section`) and one `<h1>` per page with headings in logical order (no skipped levels for styling).
2. **Keyboard operable** — every interactive element (links, buttons, nav, drawer, any modal/terminal) works with keyboard alone, in a sensible tab order. No keyboard traps.
3. **Visible focus** — a clearly visible focus indicator on every focusable element (use the `--accent` focus ring; never remove outlines without a replacement).
4. **Color contrast** — meet AA: ≥ 4.5:1 for normal text, ≥ 3:1 for large text and UI components/icons. The §6.3 palette is designed to pass; verify final pairings.
5. **Images have text alternatives** — meaningful images get descriptive `alt`; purely decorative visuals (e.g. the floating-code background) use `alt=""` / `aria-hidden="true"`.
6. **Skip link** — a "Skip to content" link as the first focusable element (important because the navbar is sticky).
7. **Language** — set `<html lang="en">`.
8. **Form labels** — if the contact form is built, every field has a programmatic `<label>`, and errors are conveyed by text/icon (not color alone).
9. **Reduced motion** — honor `prefers-reduced-motion` (already specified in §7.3); animated counters/typing reduce to final/static values.
10. **Links open safely** — external `target="_blank"` links use `rel="noopener noreferrer"` and have accessible names.

Basic verification: keyboard-only pass over Hero + nav + any drawer/modal, plus an automated check (axe or Lighthouse accessibility ≥ 95). Deeper, optional a11y enhancements are listed in the review at §21.7.

---

## Content Revision Log

| Date | Change |
|---|---|
| 2026-07-10 | Site-wide plain-language copy pass - meaning preserved; owner approved rewriting locked strings and re-baselining sections that had drifted from the shipped data (§8.1, §8.2, §8.3, §8.4, §8.6, §11). Renamed 2 project cards and 3 impact cards; impact bullets trimmed 4→3. |
| 2026-07-15 | Copy refresh across Impact, Experience, and Projects Preview content (§8.2, §8.3, §8.4); re-baselined the spec to match. Renamed 1 impact card ("Unlocking Google & Microsoft Data"); added tech-stack entries (Prometheus, DevOps, System Design, AI Development) and impact bullets; corrected wording. |
