# AUREL — The Eclipse Tee

A premium, single-product T-shirt landing page with a complete WhatsApp order-enquiry flow.
Built as a static site: no database, no authentication, no payment integration, no server to maintain.

---

## 1. Stack decision

| Concern | Choice | Why |
| --- | --- | --- |
| Framework | **Next.js 16 App Router** with `output: "export"` | Real component structure, file-based metadata, static HTML output, first-class Vercel/Netlify support. |
| Language | **TypeScript** | One typed product configuration file and safer order-form changes. |
| Styling | **Hand-written CSS** with design tokens | A single editorial product page needs art direction, not a utility-class layer. Keeps dependencies and markup clean. |
| Motion | **CSS + one small IntersectionObserver** | No animation library, no layout animation jank. |
| Images | **Responsive AVIF + WebP** | Art-directed, compressed, lazy-loaded below the fold, width/height attributes prevent layout shift. |
| Fonts | **Self-hosted WOFF2** (Archivo, Instrument Serif, DM Mono) | No third-party font requests, stable rendering, fast repeat visits. |
| Ordering | **Client-side form → WhatsApp `wa.me` deep link** | Matches the manual order workflow; zero backend or payment risk. |
| Hosting | **Static files** (`out/`) | Free/cheap on Vercel, Netlify, Cloudflare Pages or any static host. |

The site intentionally avoids Tailwind, a CMS, a database, a cart library and a payment provider. For one product with a human confirmation step, those add cost and failure modes without improving conversion.

---

## 2. What is included

- Editorial responsive landing page: announcement bar, navigation, hero, product gallery, product information, benefits, interactive size guide, brand story, review area, FAQ, final purchase section and footer.
- Five-image interactive gallery with keyboard-accessible thumbnails and full-screen lightbox.
- Size, colour and quantity selection.
- Mobile sticky purchase bar.
- Accessible, validated WhatsApp order drawer:
  - size, colour and quantity validation;
  - name, country, city, address, postal code;
  - optional email and notes;
  - price and product subtotal in the generated message;
  - no claim that the order is confirmed.
- Configurable WhatsApp number and prefilled support message.
- Configurable USD price, sizes and colours.
- Editable placeholder specifications, sample size chart and clearly-labelled demo reviews.
- Full policy page template set: shipping, returns, privacy, terms.
- SEO metadata, Open Graph/Twitter image, sitemap and robots.
- Product structured data scaffold that stays off until accurate product data is entered.
- Accessibility: skip link, semantic landmarks, focus management, focus trapping, keyboard gallery, reduced-motion support and passing automated WCAG checks.
- Browser test suite for form validation, WhatsApp URL generation, gallery, size guide, mobile menu, sticky CTA and link integrity.
- Setup, deployment and owner-editing documentation (this file).

---

## 3. Quick start

Requirements: **Node.js 20.9+** and npm.

```bash
npm install
npm run dev
```

Open the URL printed by Next.js (normally `http://localhost:3000`).

Production build and local preview:

```bash
npm run build
npm run preview
# http://127.0.0.1:4173
```

`npm run build` writes a complete static site to `out/`.

---

## 4. Project structure

```text
.
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx              # fonts, global metadata, skip link
│  │  ├─ page.tsx                # landing page composition + optional product schema
│  │  ├─ globals.css             # design system and all responsive styles
│  │  ├─ icon.svg                # favicon
│  │  ├─ robots.ts
│  │  ├─ sitemap.ts
│  │  └─ policies/[slug]/page.tsx # static policy pages
│  ├─ components/
│  │  ├─ sections/               # hero, why, story, reviews, FAQ, final CTA…
│  │  ├─ OrderProvider.tsx       # shared size/colour/quantity + drawer state
│  │  ├─ OrderDrawer.tsx         # validated order enquiry form
│  │  ├─ ProductGallery.tsx      # gallery + lightbox
│  │  ├─ ProductPanel.tsx        # product options and details
│  │  ├─ SiteHeader.tsx
│  │  ├─ Footer.tsx
│  │  └─ …
│  ├─ config/site.ts             # ← owner editing starts here
│  └─ lib/
│     ├─ order.ts                # validation + WhatsApp message builder
│     └─ site.ts                 # money/WhatsApp helpers
├─ public/
│  ├─ fonts/                     # self-hosted WOFF2 files
│  ├─ images/                    # responsive AVIF/WebP product imagery
│  └─ og-image.jpg               # 1200×630 social preview
├─ art-source/final/             # source JPGs used by the image pipeline
├─ scripts/
│  ├─ optimize-images.mjs        # AVIF/WebP responsive image builder
│  └─ serve.mjs                  # local static preview server
├─ tests/
│  ├─ e2e.mjs
│  ├─ accessibility.mjs
│  └─ responsive.mjs
├─ netlify.toml
├─ next.config.ts
└─ package.json
```

---

## 5. Configure the site

Almost all owner-editable content lives in:

**`src/config/site.ts`**

Search for **`OWNER:`** to jump to launch-critical placeholders.

### 5.1 Set the domain

```ts
siteUrl: "https://your-domain.com",
```

This drives canonical URLs, Open Graph URLs, `sitemap.xml` and `robots.txt`. Update it **before** deploying.

The logo is centralised through `brand.wordmark`, `brand.logoSubmark`, the `EclipseMark` SVG in `src/components/icons.tsx`, and `src/app/icon.svg`. Update those together if you replace the brand mark.

### 5.2 Configure WhatsApp

```ts
whatsapp: {
  number: "12025550147",       // digits only, international format
  display: "+1 (202) 555-0147",
  isPlaceholder: true,         // set to false after replacing
  supportMessage: "Hello AUREL…",
  responseNote: "…",
}
```

- Use the international number **without** `+`, spaces, brackets or dashes.
- The current number is a **reserved fictional demo number**. Replace it before launch.
- Send yourself one real test message after changing it.
- Links use the official `https://wa.me/<number>?text=<url-encoded-message>` format.
- The message explicitly says the enquiry is not confirmed. Keep it that way.

### 5.3 Product price, sizes and colours

```ts
product: {
  price: 58,                   // USD
  sizes: [{ label: "S", available: true }, …],
  colors: [{ name: "Bone", hex: "#E8E1D5", note: "Warm off-white" }, …],
}
```

- **Set unavailable sizes** to `available: false`; the UI disables them.
- Add or remove colours safely; the order message and selectors read from this array.
- The product price is shown separately from shipping. Shipping is always confirmed manually by default.
- If you later move away from USD, update `currency` and the money formatting helper.

### 5.4 Shipping estimates

Shipping is **manual by default**:

```ts
shipping: {
  mode: "manual",
  flatRate: null,
  manualLabel: "Confirmed via WhatsApp",
  estimateLabel: "Estimated shipping",
}
```

If the studio has a verified flat shipping rate, set:

```ts
shipping: {
  mode: "flat",
  flatRate: 12,
  …
}
```

The product panel and order summary then show product subtotal, estimated shipping and an estimated total. The WhatsApp message includes both figures and still says the final total is confirmed by the studio. Do not set a flat rate unless it is accurate for the destinations you serve.

### 5.5 Replace placeholder product facts

Material, fit and care are intentionally unset:

```ts
material: {
  value: null,
  placeholder: "…",
  status: "To be confirmed",
},
```

When the studio verifies the facts, set `value` to the real copy. The pending label disappears automatically. Do not publish unverified fabric, weight, origin or care claims.

The sample size chart is also marked as a placeholder. Replace every number, then set:

```ts
sizeGuide: {
  isPlaceholder: false,
  …
}
```

The sample-measurement notice then disappears.

### 5.6 Reviews

The current review cards are **demo layout previews**, not customer testimonials. They are explicitly labelled in the UI.

To publish genuine reviews:

1. Obtain permission from the customer.
2. Add the review slot/name, quote, location and rating to `reviews.items`.
3. Set `reviews.demo` to `false`.
4. Optionally set `reviews.aggregate` (for example `{ rating: 4.9, count: 12 }`).

Never invent reviews, ratings or customer names.

### 5.7 Shipping, payment, returns and legal pages

Edit the `product.shippingSummary`, `product.returnsSummary`, `faqs` and `policies` entries in `src/config/site.ts`.

The current copy deliberately makes **no delivery-time, returns-window, tax or payment promises**. Only add terms you can honour. Replace the `OWNER:` placeholders in the legal pages with verified business details and jurisdiction-specific consumer disclosures.

### 5.8 Social and contact links

Update:

```ts
socials: [
  { label: "Instagram", href: "https://www.instagram.com/" },
  { label: "Pinterest", href: "https://www.pinterest.com/" },
],
contact: {
  email: null, // set a real email if you want it shown
  hours: "…",
}
```

The links currently point to the platform home pages and are placeholders.

### 5.9 Structured data

Product JSON-LD is disabled because the product's price, SKU, material and availability are not yet verified:

```ts
structuredData: {
  enabled: false,
  sku: "",
  condition: "https://schema.org/NewCondition",
}
```

Enable only when **every** field is true. The schema must never claim stock, ratings or specifications that do not exist.

---

## 6. Replace the imagery

The included photography is **placeholder art direction** for this demo. For a commercial launch, replace it with photography of the actual garment.

### Easiest route

Keep the same file names in `public/images/` and overwrite the existing responsive files. Available widths:

| Image key | Widths available |
| --- | --- |
| `hero` | 640, 960, 1280, 1600, 2000 |
| `front` | 640, 900, 1200, 1600, 2000 |
| `back` | 640, 900, 1200 |
| `detail` | 600, 900, 1200, 1400 |
| `lifestyle` | 800, 1200, 1600 |
| `fabric` | 600, 900, 1200 |

Each width exists as `.avif` and `.webp`.

Also update the `alt`, `label` and `caption` text in `product.images`.

### Using the image pipeline

1. Place source JPGs in `art-source/final/` named `hero.jpg`, `front.jpg`, `back.jpg`, `detail.jpg`, `lifestyle.jpg`, `fabric.jpg` and `og.jpg`.
2. Run:

```bash
npm run images
```

3. The script regenerates AVIF/WebP variants and the social image. It uses `sharp` (already in dev dependencies).

If you change the available widths, update `src/components/ResponsiveImage.tsx` so the `srcset` and intrinsic dimensions stay in sync.

### Image credits and licensing

See [CREDITS.md](./CREDITS.md). The stock photographs are placeholders and should not be used to imply that the models endorse this product. Replace them before commercial launch.

---

## 7. Order flow behaviour

1. Customer selects size, colour and quantity in the product panel or in the drawer.
2. The drawer validates required fields client-side.
3. On success, it builds a plain-text order summary and opens:

```text
https://wa.me/<digits>?text=<encoded message>
```

4. The customer must press **Send** inside WhatsApp.
5. The site explicitly states that the order is **not confirmed** until the studio replies.
6. No form data is stored by this site. No payment is collected.

The information included in the message:

- product name and edition;
- size, colour and quantity;
- unit price and estimated product subtotal (when a price is configured);
- full name, country, city, address, postal code;
- optional email and notes;
- a request to confirm availability, shipping and payment instructions.

To test without messaging a customer, temporarily set the WhatsApp number to your own and complete a test on desktop and mobile.

---

## 8. Deployment

### Vercel

1. Push the project to a Git provider.
2. Import the repository in Vercel.
3. Framework preset: **Next.js**.
4. Build command: `npm run build`.
5. Output is generated as static files in `out/` by Next.js.
6. Add your production domain and update `siteUrl` in `src/config/site.ts`.
7. Redeploy so canonical, sitemap and Open Graph URLs use the correct domain.

### Netlify

`netlify.toml` is included:

```toml
[build]
  command = "npm run build"
  publish = "out"
```

Connect the repository, or drag the generated `out/` folder into Netlify Drop. Add the domain and update `siteUrl`.

### GitHub Pages

The repository includes `.github/workflows/deploy-pages.yml`. It builds the static export and deploys `out/` to the project site at `https://rashlakshan.github.io/single-product-tshirt-store/` whenever `main` is updated. In the repository settings, open **Pages** and choose **GitHub Actions** as the publishing source. The workflow sets `NEXT_PUBLIC_BASE_PATH` and `NEXT_PUBLIC_SITE_URL` so links, images, fonts, canonical URLs and the sitemap use the repository-site path. Update those workflow values if the repository name or owner changes. For a custom domain, set `NEXT_PUBLIC_BASE_PATH` to an empty value and set `NEXT_PUBLIC_SITE_URL` to the domain.

### Any static host

Upload the contents of `out/` to Cloudflare Pages, GitHub Pages, S3/CloudFront, etc. Clean URLs use trailing slashes (`/policies/shipping/`).

### After deployment

- Test the WhatsApp link on a real phone.
- Check `/robots.txt` and `/sitemap.xml`.
- Check the social preview with the [Open Graph debugger](https://developers.facebook.com/tools/debug/).
- Replace placeholder numbers, links, images, measurements and policy copy.
- Confirm there are no `OWNER:` or `To be confirmed` strings left in customer-facing copy.

---

## 9. Testing

The test scripts use Playwright with your locally installed Chrome (no browser download required).

### Install and run

```bash
npm install
npm run build
npm run preview
```

In another terminal:

```bash
npm run test:e2e
npm run test:a11y
npm run test:responsive
```

If Chrome is not at the default Windows path, set `CHROME_PATH`:

```powershell
$env:CHROME_PATH = "C:\Program Files\Google\Chrome\Application\chrome.exe"
npm run test:e2e
```

```bash
# macOS example
CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npm run test:e2e
```

The test suite covers:

- form validation and focus handling;
- generated WhatsApp URL and message content;
- size/colour/quantity selection;
- gallery and lightbox;
- inch/cm size guide;
- FAQ accordions;
- mobile menu and sticky CTA;
- no horizontal overflow at 320–1920 px;
- broken images and internal links;
- automated WCAG A/AA checks;
- JavaScript-disabled content fallback.

Generated test screenshots are written under `art-source/test-shots/` and `art-source/responsive/` for inspection.

### Type check

```bash
npm run typecheck
```

---

## 10. Performance and SEO notes

- Static HTML export; no server rendering required at request time.
- Self-hosted fonts with `font-display: swap`; key fonts preloaded.
- AVIF first, WebP fallback, width descriptors and `sizes` on responsive images.
- Hero image eager and high priority; all other images lazy-loaded.
- No animation library, no analytics, no third-party embeds, no payment SDK.
- One `h1`, semantic landmarks, descriptive alt text, structured heading order.
- Canonical, Open Graph and Twitter metadata built from `siteUrl`.
- Product JSON-LD remains disabled until verified.
- `robots.txt` and `sitemap.xml` are generated as static files.
- At the time of delivery: zero browser console errors, zero automated WCAG violations, no horizontal overflow from 320 px to 1920 px.

---

## 11. Launch checklist

- [ ] Replace the demo WhatsApp number and send a test message to the studio phone.
- [ ] Set `siteUrl` to the production domain.
- [ ] Set the final USD price.
- [ ] Confirm sizes, colours and availability.
- [ ] Add verified material, fit and care details; remove the pending labels.
- [ ] Replace the sample size chart and set `sizeGuide.isPlaceholder` to `false`.
- [ ] Replace all placeholder photography with actual product imagery.
- [ ] Replace demo reviews with genuine, permissioned reviews and set `reviews.demo` to `false`.
- [ ] Set real Instagram/Pinterest/contact links.
- [ ] Review shipping, returns, privacy and terms copy with the business owner.
- [ ] Add legal entity, jurisdiction and any required consumer-law disclosures.
- [ ] Enable Product structured data only after all data is accurate.
- [ ] Test the full order flow on iOS and Android.
- [ ] Check WhatsApp, Instagram and email links on a real device.
- [ ] Confirm no placeholder copy remains.

---

## 12. Credits

See [CREDITS.md](./CREDITS.md) for stock photography, font licences and image-processing notes.

---

## 13. Limitations

- This is a front-end template, not a fulfilment system. Orders are intentionally manual.
- There is no inventory, payment, tax, shipping-rate or order-tracking integration.
- Stock placeholder photography does not depict the actual product being sold.
- Legal and policy copy is a template and must be reviewed for the owner's jurisdiction.
