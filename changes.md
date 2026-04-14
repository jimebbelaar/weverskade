# Changes Log — Figma Feedback & Enhancements

## Navbar
- **"Menu" text added** next to the nav icon (GT Standard Medium, `0.972vw`, `-0.04em` tracking, `0.556vw` gap)
- **Logo SVG viewBox** widened from `0 0 340 44` to `0 0 344 44` — final "e" in Weverskade was clipping at the exact boundary
- **Logo 20% smaller** — desktop: `23.611vw` → `18.889vw`, mobile: `55vw` → `44vw`
- Hover opacity now applies to the entire menu button (text + icon together)

## News Section (Home)
- **Headline 20% smaller** — `2.639vw` → `2.111vw` with proportional line-height
- **Max 3 lines** — added `line-clamp-3` to news article titles

## Contact Page
- **Form spacing reduced** — gap between intro text and form: `5.278vw` → `2.5vw`
- **Wonen form updated** — replaced separate `<label>` elements with inline `placeholder` attributes (matching contact page pattern where typed text replaces the placeholder)

## Gebouw/Project Pages
- **Title line-height tightened** — `leading-normal` (~1.5) → `leading-[1.1]` on project name and tagline
- **"Woningen beschikbaar" pill** now bottom-aligned with details block (`flex flex-col justify-end`)

## Scroll-Triggered Line Entrance Animations
- **New shared component** `ScrollHeroLineSplit.tsx` — handles indented text with proper `textIndent` during measurement and `paddingLeft` on first line only during render, IntersectionObserver triggered
- **Maatschappelijk page** — statement text "Bij Weverskade geloven we dat..." now has line-by-line scroll entrance
- **Over Ons page** — story heading "Weverskade ontwikkelt en beheert vastgoed..." now has line-by-line scroll entrance
- **Home page Intro** — heading text now has the same scroll-triggered line entrance with `indent="32.083vw"`

## Home Page Intro
- **Plant image reveal** — clip-path masking reveal (`inset(100% 0 0 0)` → `inset(0 0 0 0)`) + zoom-out (`scale(1.2)` → `scale(1)`), same effect as over-ons hero image
- Separate sentinel div for IntersectionObserver (avoids clipped element never triggering)

## Portfolio & Wonen Bij Pages
- **Filters-to-cards gap reduced** — `4.583vw` → `1vw` on both portefeuille and wonen-bij pages
- Portfolio hero-to-filters spacing kept at original `7.847vw`

## Footer Parallax Reveal (All Pages)
- **New `FooterReveal.tsx` component** — wraps every Footer on all 11 pages
- Parallax effect: inner content slides from `translateY(-35%)` to `translateY(0%)` as footer scrolls into view
- `overflow: hidden` on wrapper clips the offset content
- `requestAnimationFrame` throttled for smooth 60fps
- Respects `prefers-reduced-motion`
- No changes to Footer content or styling

## Files Changed (24 files)
- `components/Navbar.tsx` — menu text, logo sizing
- `components/News.tsx` — headline size + line clamp
- `components/ContactPage.tsx` — form spacing
- `components/GebouwPage.tsx` — title line-height, pill alignment, form placeholders
- `components/SociaalPage.tsx` — scroll line entrance
- `components/Intro.tsx` — image reveal + text animation
- `components/PortfolioPage.tsx` — spacing adjustments
- `components/WonenBijPage.tsx` — spacing adjustments
- `components/ScrollHeroLineSplit.tsx` — new shared component
- `components/FooterReveal.tsx` — new parallax footer wrapper
- `components/StatsGrid.tsx` — new component (over-ons)
- `components/AerialParallax.tsx` — enhancements
- `components/Portfolio.tsx` — enhancements
- `app/over-ons/page.tsx` — scroll line entrance + footer reveal
- `app/page.tsx` — footer reveal
- `app/contact/page.tsx` — footer reveal
- `app/maatschappelijk/page.tsx` — footer reveal
- `app/nieuws/page.tsx` — footer reveal
- `app/nieuws/[slug]/page.tsx` — footer reveal
- `app/portefeuille/page.tsx` — footer reveal
- `app/gebouw/[slug]/page.tsx` — footer reveal
- `app/werken-bij/page.tsx` — footer reveal
- `app/werken-bij/[slug]/page.tsx` — footer reveal
- `app/wonen-bij/page.tsx` — footer reveal
