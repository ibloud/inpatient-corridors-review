# Not a Toy — Ink Adventure: Story & Product Integration Brief

**Relationship:** Yellow Door Ink pilot → Not a Toy Ink Adventure → Filthy Yuck!
**Status:** narrative / integration brief; adventure not yet implemented or playtested.

## Narrative-first requirement

The adventure must work as a complete, satisfying story without a product click, stream, purchase, signup, or support action. Commerce is an optional extension of story moments—not the story's objective and not a sequence of unrelated prompts.

The Not a Toy premise is the “get out of the maze” story. Build a coherent arc from the project's public Threads record and existing approved source material. Do not invent quotations, artist intent, plot facts, product claims, or character details that are not supported by the source.

## Story arc (design scaffold)

1. **Entry / orientation:** establish the maze, protagonist, immediate objective, and meaningful stakes.
2. **Exploration:** choices uncover clues and reveal different perspectives; the player can observe, ask, investigate, or take action.
3. **Pressure / consequence:** earlier choices affect later access, knowledge, relationships, or route—not just cosmetic response text.
4. **Reframe:** the player discovers what the maze is really asking them to do, grounded in the source material.
5. **Resolution:** provide meaningful endings and a clear sense of what the player changed or learned.
6. **Optional continuation:** offer a comic, music, product, or support destination only when it is contextually earned; players can decline and continue/finish without penalty.

## Product destinations are story prompts

Product references must be integrated at natural story beats. The story should introduce the item or comic in-world, explain why the player may be interested, and offer an optional external destination. Use a configured product catalog with verified URLs, not links hard-coded into narrative text.

- **Comic:** connect a comic/product destination to a clue, character, artifact, or continuation of the story. Prefer the official product page or the merchant's verified Shopify storefront URL.
- **Merchandise:** offer a relevant item at a moment where its meaning is established by the story. No purchase is required to unlock narrative branches or endings.
- **Music:** where included, connect listening to a narrative atmosphere or optional reflection. Streaming links are separate from product links.
- **Support:** optional support should be clearly labeled and independent from story progress.

## Shopify / MyShopify integration contract

Before implementing commerce links, verify the actual Filthy Yuck! store domain, current product URLs, and product availability from the public store. The store may use a custom domain or a `*.myshopify.com` domain; do not guess or substitute one.

Each configured destination should include:
- stable item key and story beat ID;
- product display name and short factual description;
- verified official product-page URL;
- optional cart permalink only if its product/variant ID is confirmed;
- fallback to the official product page when the cart link is unavailable;
- destination type (`comic`, `merch`, `music`, or `support`);
- disclosure that the destination is external and purchase is optional.

Do not place Shopify Admin credentials, private tokens, or customer data in Ink source or browser code. Do not imply endorsement, affiliate attribution, inventory, pricing, or checkout behavior without verification.

## Ink / host implementation

- Ink owns narrative state, branching, consequences, and optional story prompts.
- The host UI owns rendering, destination cards, external navigation, disclosures, accessibility, and safe URL validation.
- Product data lives in a host-side configuration object; Ink calls named story functions/tags to request a destination by stable key.
- A missing, invalid, or unavailable product destination must not block story progress.
- External clicks are user-initiated, open with safe link attributes, and do not send story variables or personal data to merchants.
- Keep story logic, products, and storefront integration testable independently.

## Acceptance criteria

- The story has a coherent beginning, development, turning point, and ending.
- Choice consequences persist across branches and are covered by tests.
- Every commerce prompt is organically connected to a story beat and can be dismissed.
- Product cards use verified official destinations and show external-link / optional-purchase disclosure.
- A player can complete the entire adventure without visiting a store or streaming service.
- No unverified product, Shopify URL, variant ID, pricing, availability, or artist approval is claimed.
- Keyboard, screen-reader, mobile, restart, and branch coverage are tested.
