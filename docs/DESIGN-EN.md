# Design Guide

Design direction for this project. Claude Code references this when building screens.

## Picking a theme

Picked at project start (`/start`). Once chosen, it's recorded in `PROJECT-OVERVIEW.md` and applied automatically in later sessions.

| Theme | Feel | Use case |
|-------|------|----------|
| **HARMONY** | Formal, warm, natural materials | Parent brand / customer-facing sites |
| **UNSTANDARD** | Casual, colorful, lifestyle-led | Younger-audience brand |
| **Custom** | Project-specific | Internal tools, experimental demos |

---

## HARMONY theme

### Color (extracted from live `shizensozainoie.co.jp` CSS)

| Purpose | Hex | Notes |
|---------|-----|-------|
| Background | `#ffffff` | Pure white |
| Body text | `#333333` | Dark gray (avoid pure black) |
| Muted text | `#555555` | Lighter dark gray |
| Brand accent | `#da2308` | Red-orange — buttons, links, emphasis |
| Sub-accent | `#e28174` | Peach / coral — decorative |
| Border (strong) | `#b3b3b3` | Mid gray |
| Border (subtle) | `#dcdcdc` | Light gray |

The "warmth" comes from photography (warm tones, low saturation), not from the UI palette. The UI itself is white + red accent + grays.

Tailwind tokens:
```ts
colors: {
  harmonyAccent: '#da2308',
  harmonyAccentLight: '#e28174',
  harmonyText: '#333333',
  harmonyTextMuted: '#555555',
  harmonyBorder: '#b3b3b3',
  harmonyBorderLight: '#dcdcdc',
}
```

### Typography
- Japanese body: Noto Sans JP
- English headings: refined serif (e.g. Cormorant Garamond) or geometric sans
- Body line-height: 1.8
- Headings: light to regular weight — never decorative

### Photography
- Natural light, warm tones, low saturation
- Documentary feel — moments over staged perfection
- Material textures (wood, fabric, plants) lead the composition
- Lifestyle-centered (people are fine)

### Tone
- Calm polite Japanese (です／ます)
- Emotional vocabulary: 驚きと感動 / 居心地 / 上質な暮らし / こだまする / 自然素材
- Soft, slow, never pushy

### Layout
- Full-bleed hero images
- Asymmetric grids
- Generous whitespace
- Masonry-style galleries

---

## UNSTANDARD theme

### Color (extracted from live `unstandard.jp` CSS)

| Purpose | Hex | Notes |
|---------|-----|-------|
| Background | `#ffffff` | Pure white |
| Text | `#000000` | Pure black |
| Brand accent | `#e9d45a` | Mustard yellow — primary accent |
| Sub-accent (bright) | `#f6dc30` | Brighter yellow |

The "LIFE IS COLORFUL" rainbow palette (used by category / section):

| Hex | Role |
|-----|------|
| `#ed1c24` | Vivid red |
| `#ea5c52` | Coral |
| `#e6b8c4` | Pink |
| `#c6d876` | Lime |
| `#8cc63f` | Green |
| `#b2d2de` | Sky blue |
| `#a4d2de` | Cyan |
| `#91c2e1` | Light blue |

Tailwind tokens:
```ts
colors: {
  unstandardAccent: '#e9d45a',
  unstandardAccentLight: '#f6dc30',
  // Rainbow — assign per category / section
  rainbowRed: '#ed1c24',
  rainbowCoral: '#ea5c52',
  rainbowPink: '#e6b8c4',
  rainbowLime: '#c6d876',
  rainbowGreen: '#8cc63f',
  rainbowSky: '#b2d2de',
  rainbowCyan: '#a4d2de',
  rainbowBlue: '#91c2e1',
}
```

### Typography
- Japanese: clean modern sans (Noto Sans JP)
- English: bold simple sans
- Graphic-style headings like "LIFE IS COLORFUL" are encouraged

### Photography
- High saturation, warm
- Lifestyle-led — textiles, plants, books, objects
- "Theirs, not perfect" feel — keep personality in
- Full-bleed heroes drive the page

### Tone
- Conversational, light keigo
- Friendly phrasing OK: 〜してみて / 〜しよう
- Keywords: あなたの好き / 暮らし / 決めすぎないデザイン

### Layout
- Layered (text over photography)
- Horizontal scrolling carousels
- Card grids
- Instagram / Pinterest visual rhythm

---

## Custom theme

For project-specific designs. On `/start`, Claude asks:

1. Do you have a reference website link?
2. Do you have a design doc (`design.md` etc.)?

If either is provided, Claude reads the source and appends a **"Project-specific design"** section to this file.

If neither, a TODO block is appended:

```
## TODO (custom theme)
- [ ] Decide primary color
- [ ] Decide fonts
- [ ] Add reference sites
```

---

## Universal rules (all themes)

### Responsive
- Mobile: 375px
- Tablet: 768px
- Desktop: 1024px+
- Mobile-first implementation

### Japanese typography
- Body line-height: 1.8
- Roomy line spacing
- No letter-spacing adjustment (default CSS)

### Accessibility
- Housing company customers include elderly users — assume that
- Body text 16px or larger
- Contrast ratio: WCAG AA minimum
- Visible focus indicator
- Buttons: 44x44px minimum tap target

### Forms
- Japanese placeholder text
- Required fields marked with red 「必須」
- Friendly Japanese error messages (see `docs/CONTENT-EN.md`)

### Images
- See `docs/ASSETS-EN.md` for image handling
- Use `next/image`
- Always provide Japanese alt text

---

## Source of these colors

All hex values above were extracted directly from the live CSS of `shizensozainoie.co.jp` and `unstandard.jp` as of May 2026.

Adjust per project as needed. If a rebrand changes the values, update this doc.
