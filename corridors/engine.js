(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Corridors = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const VERSION = 1;
  const CARE = [
    { id: 'housing', name: 'Housing', cost: 3, effect: 'Open both exits, clear two barriers, and reduce Pressure by 1.' },
    { id: 'peer', name: 'Peer Support', cost: 2, effect: 'Gather produces 3 Support instead of 2.' },
    { id: 'mobile', name: 'Mobile Response', cost: 3, effect: 'Reduce Pressure by 2 when completed.' },
    { id: 'clinical', name: 'Clinical Care', cost: 3, effect: 'Enable a consent request: spend 1 Support to reduce the other pawn’s Tension by 4 if accepted.' },
    { id: 'transport', name: 'Transportation', cost: 2, effect: 'Enable Travel: spend 1 Support and an action to reach either exit.' },
    { id: 'creative', name: 'Creative Space', cost: 2, effect: 'Gather no longer increases Tension.' }
  ];
  const EXITS = [0, 24], VOID = 12;
  const HAZARDS = [7, 17, 11, 13, 6, 18, 8, 16, 1, 23, 3, 21, 5, 19, 9, 15, 2, 22, 4, 20, 10, 14];
  const clone = value => JSON.parse(JSON.stringify(value));
  const adjacent = (a, b) => Math.abs(Math.floor(a / 5) - Math.floor(b / 5)) + Math.abs(a % 5 - b % 5) === 1;
  const built = (s, id) => s.care[id] >= CARE.find(c => c.id === id).cost;
  const phase = s => s.pressure >= 7 ? 'Shattered Boundary' : s.pressure >= 4 || s.round >= 4 ? 'Creeping Web' : 'Closed Grid';
  function initial() {
    return { version: VERSION, players: [{ position: 2, support: 2, tension: 0 }, { position: 22, support: 2, tension: 0 }], active: 0, actions: 2, round: 1, pressure: 3, barriers: [], hazardIndex: 0, care: Object.fromEntries(CARE.map(c => [c.id, 0])), pending: null, outcome: null, log: ['A new corridor begins. Player 1 has two actions.'] };
  }
  function note(s, text) { s.log.push(text); s.log = s.log.slice(-12); }
  function assess(s) {
    if (s.pressure >= 10) { s.outcome = 'collapse'; note(s, 'System collapse: Pressure reached 10. Review the rules that produced it.'); return; }
    if (built(s, 'housing') && (built(s, 'peer') || built(s, 'mobile')) && CARE.filter(c => built(s, c.id)).length >= 4 && s.pressure <= 3 && s.players.every(p => EXITS.includes(p.position))) {
      s.outcome = 'continuum'; note(s, 'Continuum: four Care projects, low Pressure, and both pawns at safe exits.');
    }
  }
  function addBarrier(s) {
    for (let attempts = 0; attempts < HAZARDS.length; attempts++) {
      const cell = HAZARDS[s.hazardIndex++ % HAZARDS.length];
      if (!s.barriers.includes(cell) && !s.players.some(p => p.position === cell)) {
        s.barriers.push(cell); note(s, 'A barrier formed at ' + square(cell) + '.'); return;
      }
    }
  }
  function finishAction(s) {
    s.actions--; assess(s);
    if (s.outcome || s.actions > 0) return;
    if (s.active === 1) {
      s.pressure++; s.round++;
      note(s, 'Round resolved: Pressure increased by 1.');
      assess(s);
      if (s.outcome) return;
      addBarrier(s);
      if (phase(s) === 'Shattered Boundary') addBarrier(s);
    }
    s.active = 1 - s.active; s.actions = 2;
    const p = s.players[s.active];
    if (p.tension >= 6) {
      p.tension = 4; s.pressure++;
      note(s, 'Player ' + (s.active + 1) + ' reached the Tension threshold: reset to 4; Pressure increased by 1.');
      assess(s);
    }
    if (!s.outcome) note(s, 'Player ' + (s.active + 1) + ': two actions. Pass the device if sharing.');
  }
  function square(cell) { return String.fromCharCode(65 + cell % 5) + (Math.floor(cell / 5) + 1); }
  function act(state, action) {
    if (!valid(state)) return { ok: false, error: 'Invalid game state.' };
    if (state.outcome) return { ok: false, error: 'This game has ended. Restart or undo to continue.' };
    const s = clone(state), p = s.players[s.active], other = s.players[1 - s.active];
    const reject = error => ({ ok: false, error });
    if (!action || typeof action.type !== 'string') return reject('Choose an action.');
    if (s.pending) {
      if (action.type !== 'respond' || typeof action.accept !== 'boolean') return reject('The other player must accept or decline the Care request first.');
      if (action.accept) { p.support--; other.tension = Math.max(0, other.tension - 4); note(s, 'Player ' + (2 - s.active) + ' accepted Care. Tension reduced by 4; 1 Support spent.'); }
      else note(s, 'Player ' + (2 - s.active) + ' declined Care. No Support spent and no Tension changed.');
      s.pending = null; finishAction(s); return { ok: true, state: s };
    }
    switch (action.type) {
      case 'move':
        if (!Number.isInteger(action.cell) || action.cell < 0 || action.cell > 24 || !adjacent(p.position, action.cell) || action.cell === VOID || s.barriers.includes(action.cell)) return reject('Move one square up, down, left, or right into an open corridor.');
        p.position = action.cell; note(s, 'Player ' + (s.active + 1) + ' moved to ' + square(action.cell) + '.'); break;
      case 'gather':
        p.support += built(s, 'peer') ? 3 : 2;
        if (!built(s, 'creative')) p.tension = Math.min(6, p.tension + 1);
        note(s, 'Player ' + (s.active + 1) + ' gathered Support' + (built(s, 'creative') ? ' without increasing Tension.' : '; Tension increased by 1.')); break;
      case 'rest':
        p.tension = Math.max(0, p.tension - 2); note(s, 'Player ' + (s.active + 1) + ' rested: Tension reduced by up to 2.'); break;
      case 'ease':
        if (p.support < 1 || s.pressure === 0) return reject('Easing Pressure needs 1 Support and Pressure above zero.');
        p.support--; s.pressure--; note(s, '1 Support spent to reduce Pressure by 1.'); break;
      case 'clear':
        if (!s.barriers.includes(action.cell) || !adjacent(p.position, action.cell) || p.support < 2) return reject('Clearing an adjacent barrier needs 2 Support.');
        p.support -= 2; s.barriers = s.barriers.filter(c => c !== action.cell); note(s, 'Barrier cleared at ' + square(action.cell) + '.'); break;
      case 'fund': {
        const card = CARE.find(c => c.id === action.id);
        if (!card || built(s, card.id) || p.support < 1) return reject('Choose an unfinished Care project and contribute 1 Support.');
        p.support--; s.care[card.id]++; note(s, '1 Support contributed to ' + card.name + '.');
        if (built(s, card.id)) {
          note(s, card.name + ' completed.');
          if (card.id === 'housing') { s.pressure = Math.max(0, s.pressure - 1); s.barriers.splice(0, 2); }
          if (card.id === 'mobile') s.pressure = Math.max(0, s.pressure - 2);
        }
        break;
      }
      case 'care':
        if (!built(s, 'clinical') || p.support < 1 || other.tension === 0) return reject('Complete Clinical Care first; a request needs 1 Support and the other pawn must have Tension.');
        s.pending = { recipient: 1 - s.active }; note(s, 'Player ' + (2 - s.active) + ' decides whether to accept Care.'); return { ok: true, state: s };
      case 'travel':
        if (!built(s, 'transport') || p.support < 1 || !EXITS.includes(action.cell) || p.position === action.cell) return reject('Complete Transportation, then spend 1 Support to travel to an exit.');
        p.support--; p.position = action.cell; note(s, 'Player ' + (s.active + 1) + ' travelled to ' + square(action.cell) + '.'); break;
      default: return reject('Unknown action.');
    }
    finishAction(s); return { ok: true, state: s };
  }
  function valid(s) {
    const integer = (v, min, max) => Number.isInteger(v) && v >= min && v <= max;
    return !!s && s.version === VERSION && Array.isArray(s.players) && s.players.length === 2 && s.players.every(p => p && integer(p.position, 0, 24) && p.position !== VOID && integer(p.support, 0, 10000) && integer(p.tension, 0, 6)) && integer(s.active, 0, 1) && integer(s.actions, s.outcome ? 0 : 1, 2) && integer(s.round, 1, 10000) && integer(s.pressure, 0, s.outcome ? 10 : 9) && integer(s.hazardIndex, 0, 100000) && Array.isArray(s.barriers) && s.barriers.length <= 22 && new Set(s.barriers).size === s.barriers.length && s.barriers.every(c => integer(c, 0, 24) && c !== VOID && !EXITS.includes(c) && !s.players.some(p => p.position === c)) && !!s.care && CARE.every(c => integer(s.care[c.id], 0, c.cost)) && (s.pending === null || (!!s.pending && s.pending.recipient === 1 - s.active && built(s, 'clinical') && s.players[s.active].support >= 1)) && [null, 'continuum', 'collapse'].includes(s.outcome) && (!s.outcome || s.pending === null) && Array.isArray(s.log) && s.log.length <= 12 && s.log.every(t => typeof t === 'string' && t.length <= 300);
  }
  function restore(raw) {
    try { const s = JSON.parse(raw); if (!valid(s)) return null; const clean = initial(); for (const k of Object.keys(clean)) clean[k] = clone(s[k]); clean.players = s.players.map(p => ({ position: p.position, support: p.support, tension: p.tension })); clean.care = Object.fromEntries(CARE.map(c => [c.id, s.care[c.id]])); clean.pending = s.pending ? { recipient: s.pending.recipient } : null; return clean; } catch { return null; }
  }
  return { VERSION, CARE, EXITS, VOID, initial, act, phase, square, adjacent, built, valid, restore };
});
