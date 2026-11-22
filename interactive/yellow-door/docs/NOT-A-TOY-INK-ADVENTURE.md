# Not a Toy — Ink Adventure: Story & Product Integration Brief

**Relationship:** Separate projects. The Yellow Door is an independent pilot and is not part of NOT A TOY or FILTHY YUCK! It served only as a technical/design reference for learning from the first interactive narrative pilot before building the NOT A TOY phase.
**Status:** Ink story draft authored and committed; separate browser-playable visual test prototype implemented. The visual test uses a hand-authored browser story renderer mirroring the Ink adaptation (not compiled Ink). Compiler validation, Ink runtime integration, and playtesting remain pending.


## Project separation\n\nThe Yellow Door pilot remains a separate project, with its own narrative, scope, and source-of-truth. It is not a prequel, chapter, shared universe, or lore component of NOT A TOY. References to Yellow Door in this document are strictly development breadcrumbs: a prior pilot whose implementation was examined to learn interaction/runtime patterns. NOT A TOY is a new phase with its own source research, canon, narrative, and build. Keep links between the projects in documentation/navigation only; do not merge story content or present them as one experience.\n\n## Lore integrity / source-of-truth rules

**Do not invent lore.** All narrative details, character names, relationships, settings, chronology, motivations, dialogue, symbolism, and artist intent must be grounded in:
1. Public NOT A TOY social-media posts and other official public materials that can be cited;
2. Source files and facts explicitly confirmed in the project repository; or
3. A reference supplied or explicitly approved by the user/artist.

Maintain a source ledger for every material story fact: fact or quote, source URL/path, retrieval date, and whether it is direct quotation, paraphrase, or approved interpretation. Do not turn song lyrics into dialogue or reproduce lyrics; use factual track titles and themes only where supported and appropriate. Search results/snippets are leads, not sufficient evidence for plot details. If the available sources do not establish a needed detail, leave it open and request a reference instead of filling it with invented lore.

### Current confirmed public-source leads (not a complete story canon)
- User-reported Threads feed research identifies a Nov. 18, 2026 post (8:03 AM) with **“get out of the maze >>> [link in bio]”** and a Nov. 17, 2026 post (8:34 AM) describing a concept album begun ten years earlier. Exact post permalinks and direct captures remain unavailable; record these as user-supplied transcriptions pending verification. Treat “get out of the maze” as a premise/phrase, not permission to invent what the maze is or who is inside it.
- User supplied indirect Facebook links titled “Get Out of the Maze Short Film” and “10-Year Concept Album Video” as cross-post leads. The actual videos have not been inspected, so they cannot yet support story details.
- Public posts identify **FILTHY YUCK!** and reference the official merch store/product page; product destination should be confirmed against the store before release.
- User supplied research describing *FILTHY YUCK!* as a futuristic dystopian cinematic dark-pop concept album with a continuous narrative: a protagonist wakes in a simulated world, battles psychological conditioning, and hacks the system to escape. The research also describes a four-act structure, over two years of album production, and ten years of music-making together. Treat these as user-supplied story/production claims pending direct primary-source verification; do not expand beyond them or invent specifics.
- User supplied the reported 17-track sequence and durations (39 minutes total), including *THE MAZE* (14), *THE ENDING* (15), *JAILBREAK THE CONSOLE* (16), and *DOOMSDAY HOLIDAY* (17), with loading interludes at tracks 7 and 13. Tracklist details remain pending official-source verification.
- The reported album narrative offers a stronger adaptation direction than track-title speculation, but source links supplied as Google redirects have not yet been resolved to canonical primary-source URLs or inspected.

**Open canon questions:** What is the maze literally/metaphorically in the approved story? Who is the player/protagonist? What existing characters or events are canon? What are the intended stakes and ending(s)? Which social posts or repository artifacts are approved narrative source material? Request an artist/user reference before authoring these details if sources don't answer them.


## Public-facing discography context supplied for this project

**Source status:** The following summary was supplied by the user as public-facing research. Treat it as a research brief, not independently verified canon; retain a source URL or citation for each official release before publishing claims externally.

- NOT A TOY is fronted by Branson Hoog, alongside Benji Spoliansky, Jeremy Marmor, and TJ Wessel (as supplied; verify against official band materials before publishing).
- The supplied summary states that *FILTHY YUCK!* was released October 16, 2026 via Broke and is a 17-track debut full-length. (Date is in the future relative to some earlier project records; verify release metadata before using in public copy.)
- The 2025 rollout described in the supplied summary includes *PLAYING W/ DEATH*, *THE MAZE*, *NPC*, and *DOOMSDAY HOLIDAY*; the *DOOMSDAY HOLIDAY* EP (August 22, 2025) packages four tracks; and *[NOT A TOY] 4LBUM L34K* (October 17, 2025) adds *KINGKILLER* and *SITH MODE* while retaining those tracks.
- The supplied summary identifies 2026 singles *DEAD EYES* (with *DEAD EYES.zip (Versions)*) and *UNALIVE ME* preceding the LP.
- The supplied tracklist context calls out interludes *LOADING... 40.4%* (track 7) and *LOADING... 73.1%* (track 13), and game/simulation/file-system naming such as *PLAYING W/ DEATH*, *NPC*, *THE MAZE*, *THE ENDING*, *JAILBREAK THE CONSOLE*, *[NOT A TOY] 4LBUM L34K*, *DEAD EYES.zip*, *H4RD_DR!V3*, and *beam me up.aif*.

### What this supports—and what it does not

These release/track-title patterns support an **interface and structural vocabulary** for an interactive adaptation: staged loading, file-like artifacts, game/simulation terminology, a sequence of releases, and player navigation/choice. They do not establish a linear plot, hidden ARG, character identities or backstories, what the maze represents, the meaning of any song/video, or the relationships among music videos. Do not invent these or infer narrative connections from titles alone.

The Ink concept may borrow interaction patterns (loading states, files, navigation, branches, system prompts) only as an adaptation design—not claim those mechanics are official band lore. The narrative facts and exact wording must be sourced from official material or approved reference.

### Canon/source ledger requirement

See [NOT-A-TOY-SOURCE-LEDGER.md](NOT-A-TOY-SOURCE-LEDGER.md) for the initial source records, supported adaptation vocabulary, and unresolved canon questions. This ledger is intentionally conservative: third-party metadata and user-supplied summaries are marked pending primary-source verification.

Before story drafting, record each proposed lore element in a table with: **claim / source URL or repo path / source type / date checked / evidence excerpt or precise locator / status** (confirmed, user-supplied pending verification, interpretation approved, or unresolved). Use public posts and official discography/video materials as evidence; repository content is authoritative only for what that repository actually confirms. No source means no lore claim. Ask for references where a story beat needs missing facts.

## Narrative-first requirement

The adventure must work as a complete, satisfying story without a product click, stream, purchase, signup, or support action. Commerce is an optional extension of story moments—not the story's objective and not a sequence of unrelated prompts.

The Not a Toy premise is the “get out of the maze” story. Build a coherent arc from the project's public Threads record and existing approved source material. Do not invent quotations, artist intent, plot facts, product claims, or character details that are not supported by the source.

## Implemented story draft\n\nThe current draft lives at [`../story/not-a-toy-ink-adventure.ink`](../story/not-a-toy-ink-adventure.ink). It is a playable-structure draft with four acts, persistent choice variables, branches, a loading interruption using the supplied track interlude percentages, a user-selected exit, and a debrief. It deliberately avoids named characters, lyrics, locations, specific official plot events, or claims about what the simulation/maze literally is. System prompts and mechanics are adaptation-original. The ending explicitly identifies this as an adaptation rather than the official album story.\n\n**Current implementation status:** Ink source written; a separate browser visual test is available at [`../../not-a-toy/`](../../not-a-toy/). It is a parallel prototype implemented in JavaScript for immediate visual review, not yet driven by compiled Ink. Do not overwrite the existing Yellow Door story or its compiled JSON. Next, compile this Ink source and replace/align the prototype renderer with a dedicated Ink runtime integration after validating the syntax.\n\n## Story arc (design scaffold)

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

## Known storefront destinations from project records

- Official storefront recorded in project history: `https://notatoymerch.myshopify.com/`
- FILTHY YUCK! comic product page recorded in project history: `https://notatoymerch.myshopify.com/products/filthy-yuck-comic`
- These are known project URLs, not a fresh live-page or inventory check. Recheck links before release. Do not create alternate domains or substitute guessed URLs.

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
