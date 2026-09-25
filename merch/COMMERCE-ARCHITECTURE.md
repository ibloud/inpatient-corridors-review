# Commerce Architecture — Break the Grid

## Status
Prototype commerce surface only. No Shopify credentials or live checkout are connected.

## Division of responsibility
**Shopify**
- Products, variants, SKUs
- Pricing
- Inventory
- Product media
- Cart
- Checkout
- Orders

**Sanity**
- Collection narrative
- Product story / object notes
- Editorial modules
- Campaign/corridor context
- Rights/provenance metadata
- Accessibility copy

## Product model
Each merch object should carry:
- handle
- title
- capsule
- SKU
- Shopify product ID
- garment type
- color
- sizes
- price
- artwork version
- placement specification
- production method
- editorial description
- alt text
- rights status
- rights notes
- release status

## LFLG capsule
- LFLG-01 — Corridor Tee
- LFLG-02 — Ghost Notice Tee
- LFLG-03 — Evidence Hoodie

## Rights gate
The current Inpatient Corridors project documentation states that public use of artist names, music, marks, likenesses or other protected material requires appropriate permission. The capsule therefore remains a design prototype until rights status is explicitly cleared.

## Integration sequence
1. Approve artwork and rights status.
2. Create Shopify products/variants.
3. Create matching Sanity editorial records.
4. Map Shopify product IDs into Sanity.
5. Replace prototype prices/status with live data.
6. Connect Storefront API cart/checkout.
7. Test mobile, accessibility, inventory edge cases and checkout.
8. Publish only after the rights gate passes.
