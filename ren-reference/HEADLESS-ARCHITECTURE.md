# Ren Makes Music — Headless Reference Build

This is a reference implementation, not a claim that it is the production Ren Makes Music site.

## Intent

Demonstrate the intended connective architecture in a working frontend:
- editorial/navigation layer
- interactive experience layer
- Shopify commerce layer
- a shared visual shell

## Boundaries

Sanity owns editorial/narrative content.

Shopify Storefront API owns buyer-facing product/catalog data and commerce.

Ink/browser runtimes own interactive story execution.

No Admin API credential belongs in browser code.

## Shopify connection

shopify-config.js contains only the store domain, API version, and a placeholder for a public Storefront API token. With the token populated, app.js requests the live product catalog directly from Shopify.

The demo deliberately falls back to fixtures when the token is absent.

## Experience integration

The current working Yellow Door and Rabbit Hole builds are linked as first-class experience destinations. The next production step would mount those runtimes into the same application shell/router rather than treating them as separate GitHub Pages sites.

## Acceptance criteria

1. Home, Music, About, Events, Shop and Interactive routes share one frontend shell.
2. Shopify catalog loads through the Storefront API.
3. Product references can be attached to experience/content records without putting narrative logic in Shopify.
4. Yellow Door and Rabbit Hole load from the same shell.
5. Admin/private credentials remain server-side.
6. A clean checkout/build reproduces the site without undocumented local state.