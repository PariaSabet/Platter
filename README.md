# Featured Collection Section

A fully responsive **Best Sellers** product section built with TailwindCSS and Vanilla JS.

## Preview

> [Live Preview](https://featuredcollectionplatter.netlify.app/)  


---

## Tech Stack

- **HTML** — semantic markup
- **TailwindCSS** (CDN) — utility-first styling, no build step required
- **Vanilla JavaScript** — all interactivity, no frameworks
- **Font Awesome** — star icons and arrow icon
- **Google Fonts** — Source Serif Pro, Bebas Neue, Poppins

---

## Features

- Horizontal scroll product slider on desktop with a custom draggable scrollbar
- 2-column grid on mobile with a smooth **Show More / Show Less** dropdown
- Image hover swap — secondary product image fades in on hover
- Pill/badge system — supports `outline` and `filled` variants
- Star rating display from a numeric rating value
- Fully responsive
- Custom scrollbar

---

## Structure

### `index.html`
The structural shell. Contains two separate render targets:
- `#product-slider` — desktop horizontal scroll list
- `#product-grid-mobile` + `#extra-cards` — mobile 2-col grid with show more

### `js/products.js`
data layer. Each object represents one product card — equivalent to a Shopify section block:
```javascript
{
  id:         1,
  name:       "Outside Vibes T-Shirt Sunshine",
  price:      "$104.95",
  rating:     4,
  reviews:    1234,
  pills:      [{ text: "Best Seller" }],
  image:      "https://images.unsplash.com/...",
  imageHover: "https://images.unsplash.com/...",
}
```

### `js/tailwind.config.js`
Brand design tokens — all colors are named by purpose, not value:
```javascript
brand: {
  heading: '#231F20',  // section title + stars
  badge:   '#000000',  // badge border + text
  text:    '#1C1D1D',  // product titles, prices
  subtle:  '#707070',  // review counts
  sale:    '#5C7962',  // sale badge background
  link:    '#5C553A',  // "Shop All" link
}
```

### `js/featured.js`
All JavaScript logics:
- `buildStars(rating)` — generates star icons
- `buildPill(text, options)` — generates badge pill
- `buildImages(product)` — generates primary + hover image pair
- `buildMeta(product)` — generates title, stars, price
- `buildCard(product)` — composes all sub-builders into a card `<li>`
- `renderDesktop()` — injects all cards into `#product-slider`
- `renderMobile()` — splits cards into first 4 and extras
- `initShowMore()` — smooth `max-height` toggle with cached height
- `initCustomScrollbar()` — draggable scrollbar with mouse and touch support

### `css/style.css`
Only the things Tailwind can't do:
- Hides the native browser scrollbar on `#product-slider`
- Animates the custom scrollbar thumb height on hover and drag

## Shopify Liquid Version
> [Live Preview](https://pariaaa.myshopify.com/?preview_theme_id=159209488637)
> password: towdot
>
> **Note:** The HTML version is built pixel-perfect to the original design spec.
> The Shopify version mirrors the same structure and functionality but may have 
> minor visual discrepancies due to theme CSS inheritance.

```
shopify/
├── sections/
│   └── platter-featured-collection.liquid
└── snippets/
    ├── platter-product-card.liquid
    └── platter-product-pill.liquid
```

### How the HTML maps to Liquid

| HTML / JS | Shopify Liquid |
|---|---|
| `products.js` array | Section blocks (theme editor) |
| `buildCard()` | `snippets/platter-product-card.liquid` |
| `buildPill()` | `snippets/platter-product-pill.liquid` |
| `product.image` | `product.featured_image \| image_url \| image_tag` |
| `product.imageHover` | `product.images[1]` |
| `product.price` | `product.price \| money` |
| `product.rating` | `product.metafields.platter.rating.value` |
| `product.reviews` | `product.metafields.platter.rating_count.value` |
| `pills` array | Block settings: `badge`, `show_sale`, `sale_label` |


## Design Decisions

- **Sub-builder functions** — each builder has one job (`buildPill`, `buildImages`, 
  `buildMeta`), mirroring how Shopify snippets work. If something breaks, you know 
  exactly which function to look at

- **IIFE wrapping** — all JS is wrapped in an immediately invoked function to keep 
  functions out of the global scope, preventing conflicts with other scripts

- **Pills as a data array** — each product has a `pills: []` array instead of fixed 
  `badge` and `saleBadge` fields, making any number of badges possible without 
  changing the render logic. Maps directly to Shopify block settings

- **Render once, toggle visibility** — all cards are rendered on load and shown/hidden 
  with `max-height`. Cards are never re-rendered on Show More click, avoiding reflows 
  and keeping the animation smooth

- **Cached height measurement** — the extra cards height is measured once on first 
  open and cached, so subsequent toggles never trigger a reflow

- **Scrollbar updates on `load` not `DOMContentLoaded`** — lazy-loaded images change 
  the slider's `scrollWidth` after the DOM is ready. `load` ensures the thumb width 
  is correct after all images are fully rendered

- **Custom scrollbar as a separate element** — built below the slider rather than 
  styling the native scrollbar, giving full control over position, appearance, and 
  the grow-on-hover behaviour

- **Color tokens named by purpose** — `text-brand-text` over `text-[#1C1D1D]` so a 
  single config change updates every instance across the project
