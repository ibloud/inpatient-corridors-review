# Like Father, Like Ghost — Production Merch Specification

## Capsule system
The capsule uses the existing Inpatient Corridors visual vocabulary: institutional grid, corridor geometry, evidence labels, restrained red, black/white field, and deliberate negative space.

### LFLG-01 — Corridor Tee
**Garment:** heavyweight black unisex tee
**Primary placement:** large back print
**Secondary placement:** small left-chest `LFLG / 01` mark
**Artwork:** lflg-01-corridor-tee.svg
**Print:** 2-color screen print (white + corridor red)
**Concept:** the wearer is physically inside the corridor/grid.

### LFLG-02 — Ghost Notice Tee
**Garment:** heavyweight white or washed-black tee; colorway must be tested against the artwork
**Primary placement:** large front notice
**Secondary placement:** small back-neck `NOTICE / 404`
**Artwork:** lflg-02-ghost-notice.svg
**Print:** 2-color screen print
**Concept:** absence represented as a record, not a character illustration.

### LFLG-03 — Evidence Hoodie
**Garment:** heavyweight black hoodie
**Primary placement:** large back evidence record
**Secondary placement:** small left-chest `EVIDENCE / LFLG-03`
**Artwork:** lflg-03-evidence-hoodie.svg
**Print:** 2-color screen print; embroidery is optional for the small chest mark
**Concept:** artifact / evidence / memory.

## Manufacturing gates
- Confirm garment blanks and fabric weights.
- Produce physical print proof.
- Confirm red ink against the actual garment.
- Confirm artwork minimum line weight and trapping with printer.
- Confirm final print dimensions by garment size.
- Build size/color variants and unique SKUs in Shopify.
- Photograph the actual manufactured sample.
- Replace concept SVGs in product media with approved production photography.
- Record artwork version and production method.
- Complete rights/provenance review.

## Shopify variant convention
`LFLG-[01|02|03]-[GARMENT]-[COLOR]-[SIZE]`

Example: `LFLG-01-TEE-BLK-M`

Do not activate inventory tracking until physical inventory exists.

## Sanity editorial fields
- title
- capsule
- objectCode
- shortDescription
- longDescription
- story
- designNotes
- artworkVersion
- productionMethod
- garment
- care
- altText
- shopifyProductId
- rightsStatus
- rightsNotes
- releaseStatus

## Release states
`concept` → `sample` → `approved` → `listed` → `retired`

A product may not enter `listed` without the manufacturing and rights gates above.