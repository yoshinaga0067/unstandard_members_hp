# Image & Asset Handling Guide

Where property photos and image assets live, how big they should be, and copyright rules. Housing-company apps are image-heavy — consistency matters.

## Storage location

### Phase 1 (demo)

**Without Supabase Storage**
- Path: `/public/properties/<id>/<filename>.jpg`
- Example: `/public/properties/p001/hero.jpg`
- This path is publicly accessible — never store secrets here

**With Supabase Storage**
- Bucket name: `property-photos`
- RLS: public-read OK for demo
- Upload key convention: `<property_id>/<role>.jpg` (e.g. `p001/hero.jpg`)

### Phase 3 (post-engineer review)

- Engineer has pre-configured the bucket / CDN
- Do not change storage location or RLS settings
- If changes are needed, ask the engineer

---

## Sizing & optimization

### Next.js projects
- **Always use `next/image`** — never raw `<img>` tags
- Automatic WebP conversion + lazy loading

### Recommended sizes
| Use | Dimensions | Format |
|-----|-----------|--------|
| Hero image | 1920 x 1080 | JPG (photo) / WebP |
| Property thumbnail | 640 x 480 | JPG |
| Property detail gallery | 1280 x 960 | JPG |
| Icons / logos | any | SVG (scales cleanly) |
| OGP (social share) | 1200 x 630 | JPG / PNG |

### Alt text
- **Always write in Japanese**
- Example: 「リビングから見た南向きの窓」「キッチンの全景」
- Decorative images: `alt=""` (empty) so screen readers skip them

---

## Copyright & watermarks

### Demo images
- Free stock: Unsplash, Pexels, 写真AC
- In-house photography
- **Never use a client's property photos without permission**

### Production watermarking
- HARMONY: small `© HARMONY` bottom-right
- UNSTANDARD: small `© UNSTANDARD` bottom-right
- Custom: per-project decision
- Recommended implementation: gate on `NEXT_PUBLIC_SHOW_WATERMARK=true` so only prod shows it

### Image-removal requests
- After a property is sold, customers may ask you to remove photos
- Keep a separate record of who shot each image and when permission was granted

---

## Accessibility & performance

- `next/image`'s `priority` attribute: use **only on the 1-2 above-the-fold images** — overuse hurts LCP
- Decorative imagery (background patterns): use CSS, or `loading="lazy"`
- Don't use images as a substitute for text (breaks screen readers and search)

---

## Do NOT

- Publish photos showing a customer's face without explicit permission (privacy / right of publicity)
- Upload high-resolution originals as-is — resize first
- Pass off stock photos as your own property listings (景品表示法 violation in Japan — false advertising)
- Use watermarked stock images without buying a license
