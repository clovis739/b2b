# Vantora ? Global trade. Forward.

A local Next.js 16 / React 19 implementation with 40 component-based public page types across 547 connected URL routes, 33 sector entries and 90 illustrative product records.

## Run

Use Node.js 24 or later. The backend uses Node's built-in SQLite module.

```powershell
npm.cmd install
npm.cmd run dev -- --port 3010
```

Open http://localhost:3010 and use `/site-map` for the full page directory.

Pages use Next.js filesystem routing. For example, `/about-us` is `app/about-us/page.tsx` and `/rfqs/add-rfq` is `app/rfqs/add-rfq/page.tsx`. Each page imports its reusable feature component directly. Create another `app/<path>/page.tsx` to add a URL; add it to the navigation inventory if it should appear in the directory and sitemap. There is no catch-all dispatcher or proxy whitelist.

## Check

```powershell
npm.cmd run check:site
npm.cmd run check:pages
npm.cmd run build
npm.cmd run start -- --port 3010
```

With the server running, check every route and rendered internal link:

```powershell
$env:SITE_CHECK_URL = 'http://localhost:3010'
npm.cmd run check:site
npm.cmd run check:pages
```

The check covers route/data integrity, local images, box rotation and weight limits, HTTP status, internal navigation, the sitemap and unknown-page 404 behavior.

## Structure

- `app/**/page.tsx`: 558 dedicated filesystem pages, each importing its feature component directly and declaring its local page data and metadata.
- `app/route-map.ts`: navigation, page-directory and sitemap inventory; it does not control routing.
- `components/layout/`: shared sticky header, mega menus, footer, cookie preferences and help panel.
- `components/home/`: hero/search, sectors, service tabs, freight, sourcing, events, insights and signup sections.
- `components/shared/route-page.tsx`: shared page provider and frame for filesystem pages.
- `components/pages/`: reusable feature components for all 40 page types.
- `lib/page-metadata.ts`: shared metadata defaults.
- `lib/page-types.ts`: page capabilities and review-directory metadata.
- `components/forms/`: inquiry, RFQ, freight, cargo, event, contact and product-draft forms.
- `lib/workspace.ts`: draft validation and text export.
- `components/shared/`: page frames, presentation helpers and product cards.
- `components/ui/`: brand, icons and accessible modal.
- `hooks/use-page-controller.tsx`: page controls and draft form state.
- `hooks/use-workspace.tsx`: shared guest/account storage, sync status and session recovery.
- `server/`: SQLite schema, password hashing, sessions and API validation.
- `app/api/`: account and workspace endpoints.
- `lib/navigation.ts`: typed navigation content shared by layout components.
- `components/logistics/`: freight routes, load planning, landed cost, tracking and rate-index components.
- `hooks/use-logistics-controller.tsx`: shared logistics form state.
- `lib/logistics.ts`: pure packing calculations and equipment data.
- `app/tools.tsx`: logistics component dispatcher.
- `app/site-data.ts`: sample products, sectors, articles, requests, events and FAQs.
- `reference/route-coverage.md`: scope and external integration boundaries.

## Data and production boundaries

This is an independent development preview, not a mirror of Globy's production catalog. Registration and login create real local application accounts with salted scrypt password hashes and expiring HttpOnly cookie sessions. Signed-in drafts and saved products persist in SQLite, with account isolation and revision checks for conflicting saves. Guest drafts remain in browser storage and can be copied explicitly into an account. Inquiries remain private drafts; they are not delivered or published. Freight, schedules, verification labels, cargo and events are sample data; tracking does not query carriers. The load and landed-cost tools perform local planning calculations with stated assumptions.

The default database is `data/marketplace.sqlite` (ignored by git). Set `DATABASE_PATH` to an absolute writable file path on persistent storage for deployment; keep the database and WAL files together and back them up. This implementation requires a Node server with persistent disk, rather than ephemeral serverless filesystems. Use HTTPS so session cookies receive the Secure flag. Set `NEXT_PUBLIC_SITE_URL` to your own origin. Public launch still needs password recovery/email verification, account deletion, message delivery, catalog management/publication, verified supplier records, carrier APIs, real content and reviewed operator policies. Search indexing remains disabled in `app/robots.ts`.

Backend checks use an isolated database, because they create sample accounts:

```powershell
$env:DATABASE_PATH = Join-Path (Get-Location) 'data\qa.sqlite'
npm.cmd run start -- --port 3020
# In another terminal:
$env:SITE_CHECK_URL = 'http://localhost:3020'
$env:SITE_TEST_DB = Join-Path (Get-Location) 'data\qa.sqlite'
npm.cmd run check:backend
npm.cmd run check:browser
```

Browser checks use installed Google Chrome in headless mode, create sample accounts and verify sourcing, draft, account and responsive-page flows. Do not run them against a public deployment. Production dependency audit reports no vulnerabilities; the development ESLint dependency tree currently has an unresolved `braces` advisory. Do not force-downgrade the Next.js lint configuration to resolve it.

Local photography was downloaded from Unsplash for the demo. Image names identify their subject under `public/images/`; their source IDs are in `reference/image-sources.json`. Brand names are used to identify the reference; this is not an official Globy service.

## Component architecture and reference fidelity

Homepage sliders include the five-service panel with previous/next controls and a counter, rotating trending freight offers with pause/play, and responsive event/insight card carousels with arrows, dots, keyboard navigation and touch swipe. `components/motion/carousel.tsx` provides the shared GSAP implementation. Autoplay pauses for hover/focus, stops offscreen and respects reduced motion. `npm.cmd run check:sliders` verifies these controls against `SITE_CHECK_URL`.

GSAP powers motion throughout the site: shared card hover/focus lift and image zoom, page entrances, ScrollTrigger reveals, anchor scrolling, back-to-top, navigation progress, service tabs, hero wording, dialogs and loading placeholders. `components/motion/` contains the shared implementation and `lib/motion.ts` centralizes plugins, selectors and timings. CSS defines static states; existing CSS transitions were removed. Native scrolling remains available, and `prefers-reduced-motion` disables decorative motion. Run `SITE_CHECK_URL=<local origin> npm.cmd run check:motion` for focused motion checks.

The homepage now follows the blue Globy reference: compact sticky header, search hero, sourcing shortcuts, sector cards, service tabs, freight estimates, RFQ steps, events, insights, signup banner and blue footer. Service tabs and sourcing steps are interactive; searches and CTA links use local routes. Native keyboard access, focus states, modal focus return, and reduced motion are retained.

This implements the public interface, application accounts and private workspaces with sample commercial content. It does not reproduce proprietary data or connect to Globy's services. The browser test writes responsive checks to `reference/browser-validation.json` and representative screenshots to `reference/browser/`.

## Test marketplace

The member marketplace lives at `/trade`. `/workspace/trading` submits products and RFQs for approval, `/workspace/moderation` reviews submissions, and `/workspace/messages` contains private inquiry and quote threads. Supplier accounts can publish products and send quotes. Verified buyers and suppliers can create RFQs. Editing a published listing requires another review. Administrators cannot approve their own submissions.

Copy `.env.example` to `.env.local` for local testing. `MARKETPLACE_TEST_MODE=true` disables all external email delivery; verification and recovery links appear only in the signed-in account?s private test mailbox under account settings. Tokens expire, are single-use and stored as hashes. Recovery signs out existing sessions. Account deletion requires email and password confirmation and removes listings and shared conversations as described in the form.

After starting the local development server on port 3003, run `npm.cmd run seed:test`. For a different local port, set `SITE_CHECK_URL` first. The idempotent seed uses normal registration, verification, submission and moderation APIs and creates explicitly synthetic listings. Test credentials:

| Role | Email | Test-only password |
| --- | --- | --- |
| Buyer | buyer@example.test | Marketplace-Test!2026 |
| Supplier | supplier@example.test | Marketplace-Test!2026 |
| Moderator | moderator@example.test | Marketplace-Test!2026 |

Administrator access comes exclusively from the `ADMIN_EMAILS` environment allowlist. Keep test mode on for this preview. SMTP support is implemented for future configuration using the variables documented in `.env.example`; no live email service or supplier feed is configured. Public reference catalogs, articles and events still contain labeled sample content. The member marketplace stores actual test submissions separately. Exact page-by-page reference fidelity and real content import remain separate work.

For automated tests, start an isolated production server on port 3020 with `DATABASE_PATH` set to a new database under `data/`, `MARKETPLACE_TEST_MODE=true`, and `ADMIN_EMAILS=moderator@example.test`. Then set `SITE_CHECK_URL=http://localhost:3020` and `SITE_TEST_DB` to that same database path. Run `npm.cmd run check:trade` followed by `npm.cmd run check:trade-browser`. These scripts create synthetic accounts, test authorization, email links, publication, moderation, messages, quotes, recovery and deletion. They write reports under `reference/`. The automated API suite uses its own moderator password and must run on a fresh QA database, separately from the seeded development database.

Interface icons use Lucide React, and footer social brand icons use Font Awesome Brands. Custom SVGs remaining in logistics components are data charts rather than interface icons.

## Typography

Manrope (Google Fonts) is self-hosted through `next/font/local` from `app/fonts/Manrope-Variable.ttf`. The font is variable from weight 200 to 800, with swap loading and adjusted fallbacks. `app/typography.css` owns shared typography and product-card hierarchy. The original font license and font log are included with the font and publicly available at `/fonts/manrope/`. Product catalogs continue to label sample records; registered supplier products can be submitted in `/workspace/trading` and appear in `/trade` after moderation.

Homepage section refinements: freight offers use the reference India/Germany and India/Italy routes with working calculator destinations; sourcing has three interactive steps; the calendar and Insights use the shared sliders; the marketplace introduction contains the three supplied paragraphs. Footer links have GSAP background hover/focus effects with reduced-motion support and no underlines. Section checks and screenshots are in `reference/home-sections-validation.json` and `reference/browser/home-*.png`. Direct reference screenshots were blocked by Globy?s browser challenge; the public page structure and copy informed this pass.

## Trade-show images and footer

The home calendar and public event listing now use five sourced Globy event records with the original event logos downloaded from `media.globy.com`. Files live under `public/images/events/`; provenance is in `reference/event-image-sources.json`. Each card has a dedicated local page with source and organizer links. The original demonstration event URLs are retained for existing links, but the main calendar lists the sourced records. Dates are a snapshot checked on 21 October 2026; the WT Asia record discloses the source?s conflicting city information.

The footer follows the reference?s five link groups (3/5/3/2/3 links), with a brand/about row, circular social icons, contact action and separate legal strip. GSAP hover backgrounds, keyboard focus and underline removal are preserved. Internal links point to the local implementation.

Event date formatting normalizes ICU range whitespace to prevent Node/Chrome hydration differences. All 558 routes and internal links passed after adding the five sourced event pages.

About Us now follows the current Globy mission/problem/ecosystem/experience/ten-step journey/vision structure. The reference statistics are explicitly attributed to Globy. The local page uses Manrope, Lucide icons and shared GSAP entrances, card feedback and scrolling. Desktop, tablet, mobile and 320px layout checks are recorded in `reference/about-validation.json`.

Blog listing: `/blog` now uses reusable editorial navigation, a featured story with three supporting articles, six topic sections, search and empty states, category pages, and author links. The layout is based on the current Globy blog structure while the articles remain original demonstration editorial. Article images are local assets. `reference/blog-validation.json` covers search, category/article navigation and four responsive widths.

Blog source-content correction: the public listing uses eight attributed Globy source records from `app/blog-source-data.ts`, including original titles, author credits, categories and publication dates. Full article bodies have not been copied. Local demonstration article URLs remain available separately.

Blog images: all eight source-topic articles now have required local `image` and `imageAlt` fields, used on listing cards, article headers and related-article cards. Files live in `public/images/blog/`; these are topic-specific illustrative Unsplash photographs, not verified original Globy assets (the source continues to return HTTP 403). Image provenance is recorded in `reference/blog-image-sources.json`, and the listing and article captions identify the replacement photography. The six original demo articles retain their existing images. Browser loading and responsive checks are in `reference/blog-images-validation.json`.

Blog routing correction: all eight sourced article cards now navigate in the same tab to dedicated local `app/blog/<slug>/page.tsx` pages. The original Globy URL is a secondary, explicitly labeled source link. Full external article text and original image files have not been imported. Routing coverage is recorded in `reference/blog-routing-validation.json`; the navigation inventory contains 566 routes.

Blog detail expansion: `lib/blog-article-content.ts` provides eight independently written companion explainers (558–669 words each), explicitly distinguished from the source authors' original work. Each has an introduction, three key takeaways, five topical sections, a conclusion, reading time, contents navigation and related local articles. Selected explainers include primary-source further reading. The shared `SourceArticlePage` provides responsive longform typography and GSAP anchor scrolling through the existing motion system. Content coverage is recorded in `reference/blog-content-validation.json`; browser checks are in `reference/blog-detail-validation.json`.

HTTP status screens: `/status` provides a gallery of 39 IANA-listed 4xx/5xx codes, with dedicated filesystem pages at `/<code>` (unused 418 is excluded; obsolete 510 is explicitly labeled). Shared `components/status/status-page.tsx` provides responsive recovery actions, Lucide icons and existing GSAP motion. Unknown routes use the new 404 screen; `app/error.tsx` and `app/global-error.tsx` provide retryable 500 fallbacks without rendering internal error details. These design routes do not change API responses or enforce access control. Next.js gives `/404` and `/500` their native response codes; other preview routes return 200. All previews are noindex and excluded from sitemap.xml. Navigation contains 606 routes and 41 page types.

Landed-cost calculator: `/landed-cost/product` now uses a four-stage product / route / costs / results workflow. Shared components live under `components/logistics/landed/`, with an independent calculation function in `lib/landed-cost.ts`. Sea, air and road inputs, integer package/container counts, editable estimates, valuation-base overrides, recoverable import tax, negative margins and CSV export are supported. Prices and rates are user-entered USD planning inputs; no live tariff or freight API is implied. The tutorial thumbnail and video ID come from the linked Globy reference; video loads only after a user click. Reference provenance and validation are in `reference/landed-reference.json`, `reference/landed-calculation-validation.json` and `reference/landed-browser-validation.json`. Run `node scripts/check-landed-browser.cjs` with optional `SITE_CHECK_URL` to verify the flow.

Landed FAQ motion: `components/ui/animated-disclosure.tsx` preserves native details/summary keyboard behavior while GSAP animates opening, closing and the chevron. Interrupted tweens are reversed from their current height, open panels return to automatic sizing, and reduced-motion users receive immediate toggles. The calculator now uses scoped green/teal tokens based on the linked tutorial; this remains a provisional color match because the original stylesheet is inaccessible. Animation and keyboard checks are recorded in `reference/landed-faq-validation.json`.

Sitewide dropdown theme: `app/dropdowns.css` applies the shared blue theme to native select controls and navigation/language menus. The landed calculator inherits its confirmed green/teal theme. Supporting browsers use `appearance: base-select` for branded option panels, selected checks, hover/focus states, scrollbars and Lucide SVG chevrons; older browsers retain native option panels with styled controls. Native labels, keyboard/typeahead, validation, disabled fields, change events and FormData are preserved. No dropdown animation is added outside the existing GSAP system. Inventory and browser checks are recorded in `reference/dropdown-inventory.json` and `reference/dropdown-validation.json`.

Landed-cost reference completion: all 11 main sections now follow the public reference order, including the eight-row cost table, total/unit formulas, supplier-price comparison, pre-order comparison tools, margin example and customs-duty explanation. Seven FAQ topics match the reference coverage and retain GSAP disclosure motion. Body copy and numerical examples are independently written. The shared header/footer remain in place; no claim of pixel-exact matching is made because original stylesheet access is blocked. Section order, local tool links, responsive widths and FAQ interactions are verified in `reference/landed-section-validation.json`.

Load calculator rebuild: `/load-calculator` and its three existing variants use a three-stage Products / Container & Trucks / Stuffing result planner. Up to 12 cargo types support bounding dimensions, whole quantities, item weight, horizontal rotation and upright stacking. `lib/load-planner.ts` uses conservative separate lengthwise sections, allocates up to 1,000 loads and checks internal dimensions and payload. Equipment presets include standard/high-cube/reefer containers and trucks; custom dimensions are available. Results provide per-load counts, weight/volume metrics, a capped SVG isometric/top preview and CSV export. This is not a certified stuffing or axle-load planner. The reference workflow, benefits, audiences, features, related calculators and CTA sections are implemented with original explanatory copy. The blocked original banner is replaced by the existing local container image. Validation/provenance live in `reference/load-*.json`; run `node scripts/check-load-browser.cjs` with optional `SITE_CHECK_URL` for the UI workflow.

Load how-it-works hover motion: `components/logistics/load/how-motion.tsx` uses scoped GSAP timelines for the four SVG illustrations (dimension labels/cargo, equipment cards/truck, chart segments and container/view label). Pointer exit reverses from the current progress; keyboard focus also plays the effect, and reduced-motion preference disables it. Original live motion could not be verified because the source continued to return 403, so these are recreated effects rather than a claimed exact sequence. Interaction checks are recorded in `reference/load-how-hover-validation.json`.


Responsive audit: the shared header switches to the mobile menu at 1050px. Menu controls have 44px touch targets, nested Escape focus handling, scrollable categories, and reset on breakpoint changes and browser history navigation. Mobile fields use 16px text, filters wrap, and cookie/help panels stay within short viewports. Against a local server, set `SITE_CHECK_URL` and run `npm.cmd run check:responsive` (43 representative layouts, 11 widths from 320 to 1440px) and `npm.cmd run check:mobile-menu` (touch, portrait/landscape, focus, navigation, form text and cookie controls). Results are written to `reference/responsive-audit.json` and `reference/mobile-menu-validation.json`. These are headless Chrome emulation checks, not physical-device certification.


Brand: Vantora. Shared brand settings live in `lib/brand.ts`. Existing browser-storage keys and legacy author URLs are retained so saved drafts, consent and bookmarks continue to work. Globy references in source credits and catalog provenance identify the original reference, not the Vantora brand.
