# Yellow Door — Review / Completion Matrix

**Review boundary:** Creative/story build complete enough for human review. Further platform integration is intentionally deferred.

## Current state

| Layer | Status | What is true now | What remains |
|---|---|---|---|
| Six video encounters | **IMPLEMENTED** | Six individually identified YouTube videos are presented one at a time inside Yellow Door. | Human review of pacing, framing, and presentation. |
| Exact video provenance | **DOCUMENTED** | Each encounter has an exact YouTube video ID/URL in the implementation and below. | Human review of attribution/permission requirements. |
| Ink corridor story | **IMPLEMENTED** | The existing Yellow Door Ink story opens after the sixth video encounter. | Human review of whether the handoff should remain sequential-only. |
| Video → Ink state | **SEQUENTIAL HANDOFF** | The videos currently lead into Ink; watching a particular video does not set a distinct Ink variable or branch. | Decide later whether media should affect story state. |
| Music-source layer | **PARTIAL / DEFERRED** | YouTube is the implemented encounter source. The supplied playlist remains source/context. | Add Spotify/Apple Music only if there is a defined product/story reason and exact source identifiers. |
| Headless application shell | **NOT YET INTEGRATED** | Yellow Door remains an experience runtime rather than being mounted into the shared headless shell. | Future integration into the shared application/router. |
| Commerce | **DOCUMENTED / DEFERRED** | Shopify is the documented headless commerce layer; no public repo claim establishes an authorized Ren store connection. | Authorized Storefront credentials and production integration, if later desired. |
| Rights / provenance | **DOCUMENTED / HUMAN REVIEW** | External videos are embedded; the project does not claim ownership, endorsement, commissioning, or participation. | Human review of any permission, licensing, or use requirements. |
| Deployment | **VERIFY BEFORE CALLING LIVE** | Code is committed to the repository. | Freshly verify the deployment after the documentation commit. |

## Six exact encounters

| # | Work | YouTube video ID | Embed target |
|---|---|---|---|
| 1 | **So The Story Goes...** | `u1qtyMPokZM` | `https://www.youtube-nocookie.com/embed/u1qtyMPokZM?rel=0` |
| 2 | **CTRL ALT DELETE** | `X--PXyB1Zw0` | `https://www.youtube-nocookie.com/embed/X--PXyB1Zw0?rel=0` |
| 3 | **Truth or Dare** | `FmaBhsRfhIw` | `https://www.youtube-nocookie.com/embed/FmaBhsRfhIw?rel=0` |
| 4 | **Dream Life** | `0HhRNbZ0wRY` | `https://www.youtube-nocookie.com/embed/0HhRNbZ0wRY?rel=0` |
| 5 | **Two's On A Cigarette** | `1WCfWxgEY8E` | `https://www.youtube-nocookie.com/embed/1WCfWxgEY8E?rel=0` |
| 6 | **Pink Heineken** | `Ra8gSw7Djvo` | `https://www.youtube-nocookie.com/embed/Ra8gSw7Djvo?rel=0` |

## Story flow

```
Yellow Door
   ↓
SICK SICK SOUL — encounter 1
   ↓
encounter 2
   ↓
encounter 3
   ↓
encounter 4
   ↓
encounter 5
   ↓
encounter 6
   ↓
existing Ink corridor
```

This is deliberately a **story encounter sequence**, not a claim that the artists authored, selected, commissioned, approved, endorsed, or participated in the Yellow Door.

## Deferred decisions

These are intentionally **not** being solved in this review candidate:

1. Whether Spotify should be added as a source/destination.
2. Whether individual videos should write state into Ink and change later branches.
3. Whether Yellow Door should be mounted into the headless application shell.
4. Whether the commerce layer should ever become a live authorized Storefront connection.
5. Any additional personal, medical, family, biographical, or ideological material about the artists.

## Review questions

- Does the six-encounter sequence feel like part of the Yellow Door rather than a promotional interlude?
- Is the framing sufficiently neutral and non-directive?
- Is the handoff from the sixth video into Ink clear?
- Should any video affect story state, or is sequential passage the better boundary?
- Is any additional music-service integration actually needed?
- Are the attribution/provenance boundaries clear enough for external review?

## Review posture

This is an **independent prototype / review candidate**. It does not establish affiliation, endorsement, approval, commissioning, participation, licensing, or ownership by the artists or their representatives.

