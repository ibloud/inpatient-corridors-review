# Cooperative Corridors · original prototype v1

An experimental two-player, same-device cooperative game within Inpatient's existing static site. Explore both turns alone if preferred. This is a separate scenario, not an implementation of every unanswered rule in VARIANT-RULES, a Duet release, or canonical Veiled Dominion. Artist references do not imply participation or endorsement. No songs, lyrics, recordings, third-party boards, or game assets are included.

## Setup and turns

Use a 5 × 5 board, columns A–E and rows 1–5. C3 is an inaccessible Void. A1 and E5 are exits. Player 1 starts at C1; Player 2 at C5. Each starts with 2 Support and 0 Tension. Pressure starts at 3. Shared Care projects start empty.

Player 1 takes two actions, then Player 2 takes two. After Player 2's second action, Pressure increases by 1, the round increments, and barriers form. The next player then begins with two actions. Invalid actions consume nothing. The game checks its ending after every successful action, before the end-of-round increase.

At the beginning of a turn, if that player's pawn has Tension 6, reset it to 4 and increase Pressure by 1. Counters describe the game system, not a person's health, character, or diagnosis. There are no timers, hidden dice, mandatory disclosure, or personal profiles.

## Actions

| Action | Cost and result |
| --- | --- |
| Move | One action. Move one square orthogonally into an open cell. Pawns may share a square or exit. |
| Gather | One action. Gain 2 Support, or 3 with Peer Support. Gain 1 Tension, capped at 6, unless Creative Space is complete. |
| Rest | One action. Reduce your pawn's Tension by 2, to a minimum of 0. |
| Ease Pressure | One action and 1 Support. Reduce Pressure by 1, to a minimum of 0. |
| Clear barrier | One action and 2 Support. Remove one orthogonally adjacent barrier. |
| Contribute | One action and 1 Support. Add one contribution to a shared unfinished Care project. |
| Request Care | Complete Clinical Care first. Ask the other player; they explicitly accept or decline. Accept: spend 1 of the requester's Support and reduce the recipient pawn's Tension by up to 4. Decline: no Support spent or Tension changed. Both outcomes use one requester action. No other action proceeds while the decision is pending. |
| Travel | Complete Transportation first. One action and 1 Support to move to either exit; cannot target the current square. |

All nonmovement actions can be used from any open square. This first scenario deliberately leaves out line of sight, chess capture, Death/Rebirth, quadrant permissions, and multiplayer networking. Care construction is shared; Support and Tension belong to each pawn. Support does not transfer between pawns.

## Care projects

| Project | Contributions | Effect |
| --- | ---: | --- |
| Housing | 3 | Exits become safe; immediately reduce Pressure by 1 and remove the two oldest barriers. |
| Peer Support | 2 | Gather produces 3 Support. |
| Mobile Response | 3 | Immediately reduce Pressure by 2. |
| Clinical Care | 3 | Enable consent-based Care requests. |
| Transportation | 2 | Enable Travel to an exit. |
| Creative Space | 2 | Gather adds no Tension. |

Immediate effects happen only once, on completion. Completed projects cannot receive additional contributions. Exit squares are always traversable but count as safe for the ending only with Housing.

## Phases and barriers

Closed Grid: Pressure below 4 and round below 4. Creeping Web: Pressure 4–6 or round 4 onward. Shattered Boundary: Pressure at least 7. At round end, form one barrier; form two in Shattered Boundary. Phases communicate changing system pressure; they do not restrict pawn quadrants.

Barriers follow a deterministic cycle: C2, C4, B3, D3, B2, D4, D2, B4, B1, D5, D1, B5, A2, E4, E2, A4, C1, C5, E1, A5, A3, E3. Skip occupied or already blocked cells. Never block exits or the Void. If every eligible cell is occupied or blocked, no additional barrier forms. Housing removes oldest barriers; cleared cells may recur on a later cycle.

## Shared outcomes

**Continuum:** complete at least four Care projects, including Housing and either Peer Support or Mobile Response; Pressure must be at most 3; both pawns must occupy either exit. They may share the same exit. Both players win together.

**Collapse:** Pressure reaches 10. This is a system outcome, not a personal failure. Undo, restart, or discuss which rules produced it. Clinical Care and all other Care choices are optional; rejecting a request does not create a separate penalty.

No scores or personal answers transfer into The Yellow Door. Its link offers a separate narrative experience. Tarantula remains the optional music/controller learning path. PIXIE offers project navigation using the site's existing interface.

## Controls and privacy

Touch: select an adjacent square to move. Clear mode explicitly selects barrier removal; Travel has separately labeled buttons. Keyboard: Tab enters the board once; arrows explore cells, Home/End reach row edges, Enter selects. Coordinates and state labels accompany color. Blocked cells remain discoverable.

Undo retains up to 60 action states in memory. Save is explicit and stores only versioned game state in this browser's local storage. Nothing is automatically saved or uploaded. Save is unavailable during a pending consent decision. Resume and restart ask before replacing the current session. Restart retains the separate saved game; deleting the save retains the current session. Invalid saves are rejected. No accounts, AI calls, analytics, audio permission, or new backend are required. Links navigate to separate services; this is not a claim about their data practices.

## Why this implementation

Use the existing GitHub Pages repository and test workflow. Keep rules in a pure JavaScript reducer, separate from the accessible DOM interface. Borrow Duet's separation of state and presentation as a design pattern without changing its code or authoritative server. New original rules resolve this scenario's turn order, blocking, resource costs, consent, exits, and endings without silently changing the chess-inspired rules document.

Physical iPad and VoiceOver testing, gameplay balance, alternative input devices, and networked play remain review work. This is a playable prototype, not a clinically validated intervention. Implementation and documentation were assisted by Codex.
