# Luwah Technologies — Website

Next.js 15 + Tailwind CSS 4 + Framer Motion. Dark-first glassmorphism design.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages Built

| Route | Page | Status |
|-------|------|--------|
| `/` | Home (hero, process, services, portfolio, testimonials, pricing, FAQ, contact) | ✅ Complete |
| `/about` | About (story, values, team, anti-beliefs) | ✅ Complete |
| `/services` | Services (20 services in 6 categories, investment tiers) | ✅ Complete |
| `/work` | Portfolio (5 projects with metrics) | ✅ Complete |
| `/blog` | Blog listing (10 articles) | ✅ Listing complete, needs Sanity.io CMS |
| `/contact` | Contact (info cards + form) | ✅ Complete |
| `/consultation` | Multi-step intake form (4 sections) | ✅ Complete |
| `/privacy` | Privacy Policy | ✅ Complete |
| `/terms` | Terms & Conditions | ✅ Complete |

## TODO Before Launch

### Immediate
- [ ] Add logo files to `/public/images/` and update Header/Footer
- [ ] Add Daniel's headshots to About page
- [ ] Replace Google Fonts import (uncomment in `layout.tsx` or self-host)
- [ ] Connect contact form to Next.js API route → n8n webhook + Resend
- [ ] Connect consultation form to API route → n8n webhook (full + partial)
- [ ] Add Cloudflare Turnstile to consultation form
- [ ] Decide whether the accessibility report form should keep its Turnstile check. See `docs/accessibility-report-form-captcha.md`
- [ ] Set up Sanity.io CMS for blog posts
- [ ] Integrate Pagefind for site search
- [ ] Replace placeholder hero testimonial (Jamal Ortiz → real client)

### Infrastructure
- [ ] Deploy to Render (connect GitHub repo)
- [ ] Configure Cloudflare DNS (luwahtechnologies.com)
- [ ] Set up Cloudflare Tunnel for n8n connectivity
- [ ] Configure Resend (verify domain, add DNS records)
- [ ] Set up Plausible Analytics
- [ ] Add n8n chat widget (lazy loaded)

### Environment Variables (Render)
```
RESEND_API_KEY=
N8N_WEBHOOK_URL=
N8N_PARTIAL_WEBHOOK_URL=
CLOUDFLARE_TURNSTILE_SECRET=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
NEXT_PUBLIC_SANITY_PROJECT_ID=
SANITY_API_TOKEN=
CSRF_SECRET=
WEBHOOK_HMAC_SECRET=
```

## Design System

Brand tokens are defined in `src/app/globals.css` under `@theme`:

- **Background**: `#0A0F1E` (dark navy blue)
- **Copper**: `#B87333` (primary accent)
- **Lake Blue**: `#4A90A4` (secondary accent)
- **Display Font**: Century Gothic / Tw Cen MT
- **Body Font**: Open Sans

All colors, spacing, glassmorphism values, and transitions are CSS variables — change them in one place and they propagate everywhere.

## Architecture

- **Framework**: Next.js 15 (App Router, React Server Components)
- **Styling**: Tailwind CSS 4 with CSS-first configuration
- **Animation**: Framer Motion (scroll-triggered, page transitions)
- **Icons**: Lucide React
- **CMS**: Sanity.io (to be connected)
- **Search**: Pagefind (to be integrated)
- **Email**: Resend (to be connected via API routes)
- **Bot Protection**: Cloudflare Turnstile (to be added)
- **Analytics**: Plausible (to be added)
- **Hosting**: Render

## Build Docs

See the full documentation package:
1. Website Build Scoping Document
2. Consultation Intake Form Specification
3. Production Architecture Spec v2
4. Final Website Content
5. Blog Launch Articles
