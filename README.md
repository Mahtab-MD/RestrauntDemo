# Bawarchi — Restaurant Demo Website (Potheri, Kattankulathur)

A fast, mobile-first, static-friendly restaurant website built for **Bawarchi** (`Bawarchi Foods (Demo)`), designed in the **Dakhni Clay & Brass** visual language from the Stitch reference.

> **IMPORTANT DEMO NOTICE:** This repository currently contains **fictional sample data** (`noindex, nofollow` enabled). Review the checklist below before publishing for a real client.

---

## 1. How to Edit & Customize the Site

### A. Edit Menu Items, Categories & Prices
All menu items, signature dishes, prices (in `₹`), Veg/Non-Veg markers (`V` / `NV`), and descriptions live in one file:
- **`src/data/menu.json`**
  - Update `"signatureDishes"` to change the 5 featured cards on the Home page.
  - Update `"categories"` to add, remove, or re-price dishes across **Biryani**, **Starters**, **Curries**, **Breads and rice**, and **Desserts and drinks**.
  - Set `"type": "V"` for Vegetarian or `"type": "NV"` for Non-Vegetarian.

### B. Swap Placeholder Photos with Real Restaurant Photos
Named placeholder frames are stored in **`public/images/`**:
- `public/images/hero.jpg` (240×240 circular hero emblem)
- `public/images/biryani.jpg` (Chicken Dum Biryani card)
- `public/images/mutton-biryani.jpg` (Mutton Biryani card)
- `public/images/chicken65.jpg` (Chicken 65 card)
- `public/images/butter-chicken.jpg` (Butter Chicken card)
- `public/images/paneer-butter-masala.jpg` (Paneer Butter Masala card)
- `public/images/interior.jpg` (640×360 About Us dining room photo)

Replace those files with compressed real photos (`.jpg` or `.webp`, ideally under 80 KB each) and update the `imageAlt` text in `src/data/menu.json`.

### C. Change Hours, Phone Numbers, WhatsApp & Address
1. Open **`src/data/menu.json`** and update:
   - `"phoneDisplay"`, `"phoneTel"`, and `"whatsappNumber"` (e.g. `"919876543210"` without `+` or spaces for `wa.me`).
   - `"address"` fields and `"mapsSearchUrl"` / `"mapsEmbedUrl"`.
   - `"hours.regular"` (`{"open": "11:00", "close": "23:30"}`) and `"hours.friday"` (`{"open": "12:30", "close": "23:30"}`). The live IST (`Asia/Kolkata`) Open/Closed badge in `src/utils/restaurantLogic.ts` automatically reads these 24-hour times.
2. Also update the matching JSON-LD `"Restaurant"` schema block inside **`index.html`** so search engines see the same hours, phone number, and address.

### D. Remove the Demo Notice Banner & Enable Search Indexing (`noindex` -> `index`)
1. **Remove Demo Banner:** In `src/components/Layout.tsx`, remove the `<div role="region" aria-label="Demo website notice">` block at the top of the layout, and remove the `<!-- DEMO ONLY... -->` comment at line 1 of `index.html`.
2. **Enable Indexing in HTML:** In `index.html`, change `<meta name="robots" content="noindex, nofollow" />` to `<meta name="robots" content="index, follow" />`.
3. **Enable Crawling in `robots.txt`:** In `public/robots.txt`, change `Disallow: /` to `Allow: /` and update the `Sitemap:` URL to your live domain.

### E. Deploy for Free (Netlify, Vercel, or Cloudflare Pages)
- **Build command:** `npm run build`
- **Publish / Output directory:** `dist`
- **Routing:**
  - `public/_redirects` is pre-configured for **Netlify** and **Cloudflare Pages**.
  - `vercel.json` is pre-configured for **Vercel**.

---

## 2. "Before Going Live for a Real Client" Checklist

- [ ] **Replace all sample data** in `src/data/menu.json` and `index.html` (business name, proprietor name, address, landmark, email, Instagram URL).
- [ ] **Insert the real 14-digit FSSAI License Number** (replace `12345678901234 (Demo)` in `src/data/menu.json`).
- [ ] **Confirm legal entity name & jurisdiction** with the restaurant owner in `src/pages/LegalPages.tsx` (Privacy Policy under DPDP Act 2023 and Terms of Use under Chengalpattu / local courts) and remove the `"Template text, to be reviewed by the owner before publishing."` banner.
- [ ] **Replace all `/images/*.jpg` placeholder frames** with real, compressed photographs of the restaurant's own food and dining room.
- [ ] **Replace the 3 sample reviews** in `src/data/menu.json` with verified customer testimonials (with permission) and remove the `"Sample review"` / `"Placeholder"` badges.
- [ ] **Update developer credit** (`Website by [YOUR NAME]`) in `src/data/menu.json` (`restaurant.credit`).
- [ ] **Remove the top Demo Notice banner** and top HTML comment.
- [ ] **Switch off `noindex`**: update `<meta name="robots">` in `index.html` and `Disallow: /` in `public/robots.txt`.
- [ ] **Set the real production domain** in `index.html` (canonical link, Open Graph URLs, JSON-LD schema) and `public/sitemap.xml`.

---

## 3. List of Reference Deviations & Why

1. **Menu Categories, Dish Names & Exact Prices (Prompt Instructions vs. Reference HTML):**
   - *Reference (`code.html`):* Contained Hyderabad morning tiffins (`Steam Idli`, `Mla Pesarattu`, `Irani Chai`) and RTC X Roads address.
   - *Implementation:* Followed the prompt's explicit rule (*"If the reference and these instructions conflict, follow the reference for looks and these instructions for functionality"*). Preserved the exact Stitch card design, Veg/Non-Veg badges, Oswald price typography, and dotted leaders while populating the exact 5 categories (`Biryani`, `Starters`, `Curries`, `Breads and rice`, `Desserts and drinks`), 5 signature dishes, and 26 items in `₹` for **Bawarchi in Potheri, Kattankulathur**.
2. **5 Signature Dishes instead of 4:**
   - *Reference (`code.html`):* Displayed 4 signature dish cards in a 2-column grid.
   - *Implementation:* The prompt specifies 5 signature dishes (`Chicken Dum Biryani`, `Mutton Biryani`, `Chicken 65`, `Butter Chicken`, `Paneer Butter Masala`). All 5 are rendered using the exact Stitch horizontal card component.
3. **Deliberate Named Placeholder Frames in `/images/*.jpg` instead of External Hero Photo:**
   - *Reference (`code.html`):* Used an external `lh3.googleusercontent.com` image URL in the circular hero frame.
   - *Implementation:* Per the prompt (*"use named placeholders in /images (hero.jpg, biryani.jpg, chicken65.jpg, interior.jpg, etc.) with descriptive alt text, styled as deliberate photo frames. Never use stock photos that imply they are the restaurant's own"*), we created local, lightweight illustrated stamp frames in `/public/images/`.
4. **Slim Demo Notice Banner & Multi-Page Navigation (Menu, About, Contact, Legal, 404, 500/Offline):**
   - *Reference (`code.html`):* Single-page Home layout without legal pages, contact form, or error pages.
   - *Implementation:* Added the required slim demo banner at the top of every page, accessible desktop/mobile navigation in the sticky top bar, and dedicated `/menu`, `/about`, `/contact`, `/privacy`, `/terms`, `/404`, and `/error` pages designed in the exact same **Dakhni Clay & Brass** visual language.
