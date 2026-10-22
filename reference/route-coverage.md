# Public page coverage

This local Next.js build implements the public page families found through Globy's navigation. It does not mirror Globy's production database, authenticated areas, every SEO URL, or proprietary content. The public sitemap returned 404 and direct HTTP requests encountered a challenge page; those restrictions were not bypassed.

Every implemented URL has a dedicated `app/**/page.tsx` file. `app/route-map.ts` supplies the navigation inventory and the visible directory at `/site-map`; Next.js resolves the filesystem routes directly.

## Current page-type implementation

Homepage slider restoration (21 October 2026): added five-service arrows/counter and swipe navigation, rotating freight offers with pause/play, and reusable responsive GSAP carousels for all sample events and insights. Slider checks passed on development and production: navigation/boundaries, keyboard Home/End, mobile swipe, visible-slide counts, autoplay/pause and no browser errors. Screenshots are `reference/browser/sliders-desktop.png` and `reference/browser/sliders-mobile.png`; the focused report is `reference/slider-validation.json`. The original homepage's service-panel count and repeated trending freight offers informed this restoration; exact source behavior was not fully available through browser inspection.

Final slider validation: production build and targeted lint passed; all 547 route/link checks passed. The responsive suite passed all 40 page types at desktop/mobile widths after constraining the freight slider's grid column to prevent intrinsic track expansion. The final slider check passed on that production build.

GSAP motion validation (21 October 2026): shared card hover/reset and keyboard-focus effects, image zoom, page entrances, ScrollTrigger reveals, smooth anchor scrolling with focus, back-to-top, service-tab transitions, dialog entrances/exits, loading placeholders and navigation progress are implemented. CSS transitions were removed from the active stylesheets. GSAP matchMedia handles live reduced-motion preferences and effects clean up on unmount. Production build, TypeScript and targeted lint passed; focused motion checks, the full sourcing/account browser suite, all 80 responsive checks and all 547 HTTP route/link checks passed. Focused results are in `reference/motion-validation.json`.

Filesystem routing validation (21 October 2026): all 547 application URLs now have dedicated `app/**/page.tsx` files with direct feature-component imports and local metadata. The catch-all dispatcher and proxy whitelist were removed. Production build, source coverage and targeted lint passed; all 547 HTTP routes/internal links, sitemap, robots and native unknown-path 404 passed. Browser account/RFQ/draft workflows, keyboard handling and all 80 desktop/mobile viewport checks passed. The existing development preview also served the new routes.

Account/backend validation (21 October 2026): buyer/supplier registration, login/logout, profile updates, seven-day sessions, private draft and saved-product persistence, explicit guest-draft import, save conflict protection and session recovery are implemented. The default database is `data/marketplace.sqlite`; Node.js 24 and persistent writable disk are required. Guest drafts remain separate from account data.

The production build and targeted lint checks passed. Backend tests verified hashed passwords and session tokens, expired-session rejection, origin checks, account isolation, persisted data, input validation, optimistic revisions and login attempt limits. Isolated Chrome tests passed search, saved products, draft edit/remove/undo/export, registration/login/logout, profile changes, RFQ dependency selection and persisted sourcing fields, and reauthentication without losing unsaved changes. All 40 representative page types fit 1440px and 390px viewports; modal keyboard focus/Escape and mobile-menu Escape were checked. All 547 URLs and rendered internal links passed HTTP checks. Reports: `reference/browser-validation.json` and `reference/page-type-validation.json`; screenshots: `reference/browser/`.

Public launch still requires email verification and recovery, account deletion, message delivery, real catalog publication/administration, carrier services, reviewed policies and deployment setup. Application accounts are independent of Globy. The production dependency audit is clean; the development lint dependency advisory is documented in README.

All 547 URLs have dedicated page files that directly import reusable feature components for all 40 page types. The catch-all page, component dispatcher and proxy route whitelist have been removed. `/site-map` offers 40 review cards with representative links and a separate directory of all 547 URL routes. Marketplace, supplier, company, contact, freight inquiry, cargo listing, event submission, webinar and workspace screens have dedicated content and workflows. Drafts support editing, download, deletion and undo; inquiries retain their source page context. Webinar pages include original agendas and notes, with private interest drafts.

Validation commands are `npm.cmd run check:pages`, `npm.cmd run check:site`, and `npm.cmd run build`. With `SITE_CHECK_URL` set, the page-type check verifies all 40 representative screens, specialized form fields and directory cards; it writes `reference/page-type-validation.json`. The route check verifies every registered URL, page-kind marker, internal navigation and unknown-path handling. Historical inventories below describe earlier milestones.

Earlier validation (20 October 2026): production build passed; all 40 representative screens and specialized form checks passed; all 547 routes, rendered internal links, sitemap, robots and unknown-route 404 passed against the production server. Interactive browser QA was incomplete at that milestone; current browser validation is recorded above.

## Implemented

- Home; marketplace; sector/category directory and listing pages; vegetable subcategories; product details; supplier catalogs; saved products.
- RFQ introduction, request listing, request detail, local request form and quote drafts.
- Cargo introduction, available lots, lot details and local cargo form.
- Freight calculator, sample route estimates, freight inquiry form, rate trend preview.
- Load, pallet and CBM calculators, landed cost and margin, tracking preview and sample sailing results.
- Logistics overview; container shipping cost guide and country route examples.
- Blog categories, original article examples, author directory and profile.
- Event listing, event details, sample calendar export and local event submission.
- Webinar listing and inquiry preview.
- Company, contact, help collections/articles, policy pages.
- Buyer/supplier registration layouts, sign-in/reset previews and local workspace.
- Unknown routes produce a real 404; sitemap.xml lists implemented public routes.

## External integration boundaries

Accounts now register and authenticate against the application database, with salted password hashes and expiring cookie sessions. Signed-in private drafts and saved products persist in account-owned workspaces; guest drafts remain browser-local. Password recovery, email verification, account deletion, message delivery and public catalog management are still needed before public launch. Catalogs, prices, verification labels, cargo, events and freight results are illustrative. Tracking does not query carriers. Policy pages require operator review for production. Webinar recordings are not connected. Robots currently disallows indexing this demo.

## Reference

Public navigation reviewed at https://globy.com/, https://globy.com/b2bmarket/category-listing, https://globy.com/blog and the linked logistics/account pages. Separate subdomain logistics.globy.com was outside the source domain inventory.

## Validation

- `npm.cmd run build`: passed, including static generation.
- `npm.cmd run check:site`: passed for 511 registered pages, 90 products, 33 sectors, image presence and packing calculations.
- `SITE_CHECK_URL=http://localhost:3020 npm.cmd run check:site`: all 511 pages returned HTTP 200 and rendered valid internal page links; sitemap and robots returned 200; unknown route returned 404.
- All 16 local JPEG assets were validated through Sharp metadata decoding.
- Interactive browser and visual QA were not completed in this pass.

## Added RFQ creation route

`/rfqs/add-rfq` was supplied by the project owner after the initial inventory. It is now registered and linked from create-request actions. `/sourcing-request/create` remains available and uses the same RFQ form. The live reference URL returned 404 through the web fetch tool, so its exact layout and fields could not be confirmed; the local page is a functional equivalent, not a verified replica. The route registry now contains 512 pages.

## Component rebuild ? 20 October 2026

The shared shell and homepage were rebuilt against the visible blue reference. The previous page switch was extracted into reusable layout, home, page-family, form and UI components. Added 35 sector URL aliases from the reference navigation; the registry now contains 547 routes. Sample data and integration boundaries above still apply.

Final component rebuild validation: production build passed; all 547 registered pages returned HTTP 200 and resolved their internal links; sitemap and robots returned 200; unknown paths returned 404. The existing development preview at localhost:3003 served the new homepage. The implementation contains 41 reusable components across layout, home, logistics, pages, forms, shared presentation and UI. Local interaction/visual QA remains limited by concurrent input in the available browser; no pixel-perfect or live-service parity is claimed.


Test trading update: the route inventory now contains 553 dedicated application pages. Added member marketplace, published listings/RFQs, private messaging, admin moderation, email verification and reset completion. Build and lint pass (six existing unused-variable warnings). All 553 routes and internal links passed HTTP checks; all 40 page types passed representative HTTP and 80 responsive viewport checks. The API suite passed 82 checks covering verification gates, owner and participant isolation, moderation, quotes, recovery and deletion. All 24 browser trading/responsive checks passed with zero runtime errors. GSAP motion and slider checks passed. Browser trading checks and screenshots are recorded separately in trade-browser-validation.json and browser/trade-*.png. Emails stay in the private test outbox; public reference data remains sample content. A full comparison of every page against the live Globy site has not been completed.
