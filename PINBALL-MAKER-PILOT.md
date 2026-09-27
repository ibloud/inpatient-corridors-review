# Break the Grid Pinball — community maker pilot

**Status:** proposed training pilot. There is no verified stable pinball build, physical cabinet, committed venue, or artist participation. This document scopes a new original adaptation; it does not replace the existing two-player Duet prototype priority.

## Placement

Inpatient Corridors owns the pilot's rules, playfield, original assets, contributor credits, and release decision. Loptr Lab's general training pathway may link to the reusable design, fabrication, software, and accessibility exercises after they are tested. PIXIE may serve as an optional, consented learning guide; it does not control the project or collect health profiles. A physical cabinet is a separate feasibility phase, not a prerequisite for the digital table.

## Veiled Dominion growth path

The digital table can test a portable Veiled Dominion systems vocabulary: pressure thresholds, choices that redistribute support, changing board states, and a collective ending. Capture each mode as a data sheet (trigger, state change, player feedback, recovery action), then compare playtest results with the chess variant and future Duet scenario. Transfer only validated mechanics and accessibility patterns into Veiled Dominion through its own design review. This does not make the pinball table a canonical Veiled Dominion release or transfer Corridors assets or approvals.

## Related maker reference: Duet LED chessboard

The founder supplied the text of the Loptr Lab Patreon [Hackaday Build](https://www.patreon.com/LoptrLab/posts/hackaday-build-163694370) post. It describes a **proposed adaptation of an existing LED chessboard walkthrough to Duet**, not a pinball cabinet design or a completed Duet build. The linked [video walkthrough](https://youtu.be/Z92TdhsAWD4) covers a four-part 3D-printed base, eight strips of eight under-board LEDs, an Arduino Nano control panel with ten tactile switches, USB 5V power distribution, edge-coordinate LEDs, a Raspberry Pi, serial level conversion, OLED status, and final assembly. The supplied account says the reference board can run local standard chess with Stockfish or networked two-board play.

For Duet, the post proposes replacing the standard-chess referee with Duet's validate/apply/resolve rules pipeline, dropping Stockfish in favor of the planned two-human-player game, remapping LEDs for Radius of Ruin, Sanctuary, and Veiled states, and changing buttons to square-select and confirm. It identifies **standalone audio and accessibility** as new design work: speaker output, proximity-to-pitch mapping, and deterministic speech or recorded announcements. Hardware LEDs and buttons alone do not preserve browser screen-reader access.

This is a useful *parallel* maker case study for power planning, control inputs, clear status signals, firmware-to-game boundaries, and accessibility testing. It is **not** the physical pinball implementation plan. A pinball cabinet needs its own playfield, flipper/coil safety, switches, controller, power and maintenance design. Do not move the Duet chessboard proposal into the pinball bill of materials or imply the Patreon author committed to either build. The Patreon post itself was inaccessible through public retrieval when this document was updated; the description here is attributed to the founder's supplied text, and the video has not been independently audited.

## Learning question

Can players understand a system that rewards individual survival but makes collective support the way to change its rules? Test the question through pinball, where feedback and consequences are visible in motion.

## First playable specification

- One original digital playfield with two flippers, plunger, three balls, drain, restart, score, and a short rules card.
- Three named modes: Closed Grid, Creeping Web, and Shattered Boundary. A mode change alters a target or scoring rule and is announced in readable text.
- Three Support targets light a Break the Grid opportunity; completing it changes the table state and starts a short multiball. Scores and thresholds are provisional until playtested.
- A practice mode offers unlimited restarts, no leaderboard, no timer, and an optional ball-speed adjustment. Controls are remappable; status has text equivalents; flashing and sound can be reduced or disabled. Keep game completion possible without audio cues.
- No third-party music, lyrics, voice, artwork, likeness, or venue marks. The title and thematic mapping require rights/provenance review before public release.

## Training stages and evidence

| Stage | Learner exercise | Exit evidence |
| --- | --- | --- |
| 0. Observe | With venue permission where needed, study real tables and interview willing players without collecting sensitive information | Annotated playfield sketch, accessibility and consent notes |
| 1. Paper | Map shots, modes, scoring, and failure/recovery on a one-page rules sheet | A newcomer can explain the goal after a five-minute walkthrough |
| 2. Digital | Create an original table with Visual Pinball X; version source, assets, and attribution | Reproducible install and ten completed play sessions |
| 3. Playtest | Test with new and experienced players, including an accessibility review; record anonymous usability observations | Issue log, revisions, and a release checklist |
| 4. Release | Publish a tagged version, controls, license, credits, known limitations, and rollback instructions | An outside tester can install and finish a game |
| 5. Hardware study | Seek an experienced machine builder for electrical safety, cabinet design, service, transport, and cost | Separate feasibility brief and supervised build plan; no cabinet commitment |

The stage counts above are project gates proposed for this pilot, not existing results. A paper demonstration could accompany a local arcade learning crawl; it must not be advertised as an official concert or venue activation without agreement.

## References and possible mentors

- [Visual Pinball X](https://github.com/vpinball/vpinball) is an open-source table editor and simulator. Start here for a pinball-specific digital exercise; confirm a supported learner installation and licenses for any example assets.
- [Visual Pinball documentation](https://github.com/vpinball/vpinball/blob/master/docs/README.md) supports table authoring and setup.
- [Mission Pinball Framework](https://missionpinball.org/) documents software that runs physical pinball machines; its [hardware overview](https://missionpinball.org/latest/hardware/) explains compatible controllers. Use it only when a hardware mentor has scoped a safe build.
- [LITT Pinball Bar events](https://littpinballbar.com/events) list leagues and tournaments that may be useful for meeting local players. No partnership or permission is implied. Ask before recruiting or running a session there.

## Roles and boundaries

The minimum team is a rules designer, digital table author, accessibility/playtest lead, and documentation steward. A physical build also needs a qualified electrical/mechanical mentor, venue agreement if installed publicly, maintenance owner, budget, and insurance review. Participation is optional and credited only for verifiable work under agreed terms. Do not imply Chris Webby, Ren, PIXIE, LITT, or the Cabooze approved or sponsor the pilot.

## Next decision

Approve a paper design and a small digital table exercise as an Inpatient Corridors pilot. Revisit inclusion in the general Loptr Lab curriculum after learner testing; spin out a dedicated repository only when a maintainable digital release or funded hardware team exists.
