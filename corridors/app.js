(function () {
  'use strict';
  const E = window.Corridors, $ = id => document.getElementById(id);
  const KEY = 'loptr.corridors.cooperative.v1';
  let state = E.initial(), history = [], clearMode = false, focused = 2, resumeState = null;
  const cells = [], cards = [];
  function announce(message) { $('announcement').textContent = message; }
  function element(tag, text, className) {
    const node = document.createElement(tag); node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  function dispatch(action) {
    const result = E.act(state, action);
    if (!result.ok) { announce(result.error); return; }
    const prior = state;
    history.push(state); history = history.slice(-60); state = result.state; clearMode = false;
    render();
    const events = state.log.slice(state.log.lastIndexOf(prior.log.at(-1)) + 1);
    announce(events.join(' ') || state.log.at(-1));
    if (state.pending) $('consent-title').focus();
    else if (state.outcome) $('ending-title').focus();
    else if (prior.pending) $('board-title').focus();
  }
  for (let i = 0; i < 25; i++) {
    const button = element('button', '', 'cell'); button.type = 'button';
    const coordinate = element('span', E.square(i)); const contents = element('strong', '');
    button.append(coordinate, contents);
    button.addEventListener('focus', () => { focused = i; cells.forEach((b, j) => b.tabIndex = j === i ? 0 : -1); });
    button.addEventListener('click', () => dispatch({ type: clearMode ? 'clear' : 'move', cell: i }));
    button.addEventListener('keydown', event => {
      let next = i;
      if (event.key === 'ArrowLeft') next = i % 5 ? i - 1 : i;
      else if (event.key === 'ArrowRight') next = i % 5 < 4 ? i + 1 : i;
      else if (event.key === 'ArrowUp') next = Math.max(0, i - 5);
      else if (event.key === 'ArrowDown') next = Math.min(24, i + 5);
      else if (event.key === 'Home') next = Math.floor(i / 5) * 5;
      else if (event.key === 'End') next = Math.floor(i / 5) * 5 + 4;
      else return;
      event.preventDefault(); cells[next].focus();
    });
    cells.push(button); $('board').append(button);
  }
  E.CARE.forEach(card => {
    const panel = element('article', '', 'care-card');
    const heading = element('h4', card.name); const progress = element('p', '');
    const effect = element('p', card.effect); const button = element('button', ''); button.type = 'button';
    button.addEventListener('click', () => dispatch({ type: 'fund', id: card.id }));
    panel.append(heading, progress, effect, button);
    const travel = [];
    if (card.id === 'transport') E.EXITS.forEach(cell => {
      const b = element('button', 'Travel to ' + E.square(cell) + ' · 1 Support'); b.type = 'button';
      b.addEventListener('click', () => dispatch({ type: 'travel', cell })); panel.append(b); travel.push({ b, cell });
    });
    $('care-projects').append(panel); cards.push({ card, progress, button, travel });
  });
  function render() {
    const p = state.players[state.active], locked = !!state.pending || !!state.outcome;
    $('round').textContent = state.round; $('pressure').textContent = state.pressure + ' / 10'; $('phase').textContent = E.phase(state);
    $('turn').textContent = state.outcome ? 'Game ended' : 'Player ' + (state.active + 1) + ' · ' + state.actions + ' actions left';
    cells.forEach((button, i) => {
      const occupants = state.players.flatMap((pawn, j) => pawn.position === i ? ['P' + (j + 1)] : []);
      const kind = i === E.VOID ? 'Void' : state.barriers.includes(i) ? 'Barrier' : E.EXITS.includes(i) ? 'Exit' : 'Open';
      const reachable = E.adjacent(p.position, i) && i !== E.VOID && !state.barriers.includes(i);
      button.className = 'cell' + (E.EXITS.includes(i) ? ' exit' : '') + (kind === 'Barrier' ? ' barrier' : '') + (kind === 'Void' ? ' void' : '') + (occupants.length ? ' pawn' : '') + (reachable && !locked ? ' reachable' : '');
      button.lastChild.textContent = occupants.length ? occupants.join(' / ') : kind;
      button.setAttribute('aria-label', E.square(i) + ', ' + kind + (E.EXITS.includes(i) ? E.built(state, 'housing') ? ', safe' : ', needs Housing' : '') + (occupants.length ? ', ' + occupants.join(' and ') : '') + (reachable ? ', adjacent' : ''));
      // Keep blocked cells discoverable to keyboard and screen reader users.
      button.setAttribute('aria-disabled', String(locked)); button.tabIndex = focused === i ? 0 : -1;
    });
    $('player-status').replaceChildren(...state.players.map((pawn, j) => {
      const panel = element('div', '', j === state.active ? 'player active' : 'player');
      panel.append(element('strong', 'Player ' + (j + 1)), element('p', E.square(pawn.position) + ' · Support ' + pawn.support + ' · Tension ' + pawn.tension + ' / 6'));
      return panel;
    }));
    document.querySelectorAll('[data-action]').forEach(button => {
      const action = button.dataset.action;
      if (action === 'gather') button.textContent = 'Gather · +' + (E.built(state, 'peer') ? 3 : 2) + ' Support' + (E.built(state, 'creative') ? '' : ', +1 Tension');
      button.disabled = locked || (action === 'ease' && (p.support < 1 || state.pressure === 0)) || (action === 'care' && (!E.built(state, 'clinical') || p.support < 1 || state.players[1 - state.active].tension === 0));
    });
    $('request-care').textContent = E.built(state, 'clinical') ? 'Request consent for Care · 1 Support' : 'Care request · build Clinical Care first';
    $('clear-mode').disabled = locked || p.support < 2;
    $('clear-mode').setAttribute('aria-pressed', String(clearMode));
    $('selection-help').textContent = clearMode ? 'Clear mode: select an adjacent barrier. Press Clear barrier again to cancel.' : 'Choose a Care project below to contribute, or move on the board.';
    cards.forEach(({ card, progress, button, travel }) => {
      const complete = E.built(state, card.id);
      button.parentElement.classList.toggle('built', complete);
      progress.textContent = state.care[card.id] + ' / ' + card.cost + ' Support · ' + (complete ? 'Complete' : 'Shared contributions');
      button.textContent = complete ? card.name + ' complete' : 'Contribute 1 Support to ' + card.name;
      button.disabled = locked || complete || p.support < 1;
      travel.forEach(({ b, cell }) => { b.hidden = !complete; b.disabled = locked || p.support < 1 || p.position === cell; });
    });
    $('consent-panel').hidden = !state.pending;
    if (state.pending) $('consent-copy').textContent = 'Pass the device to Player ' + (state.pending.recipient + 1) + '. Do you accept this Care request? Accepting reduces your pawn’s Tension by up to 4 and spends 1 of the asking player’s Support.';
    $('ending').hidden = !state.outcome;
    if (state.outcome) {
      $('ending-title').textContent = state.outcome === 'continuum' ? 'Continuum · you reached safety together' : 'Collapse · the system reached its limit';
      $('ending-copy').textContent = state.outcome === 'continuum' ? 'Four Care projects are complete, Pressure is at 3 or less, and both pawns are at safe exits.' : 'Pressure reached 10. This is a game outcome, not a judgment of either player. You can undo, change your approach, or start again.';
    }
    $('undo').disabled = !history.length; $('save').disabled = !!state.pending;
    $('event-log').replaceChildren(...state.log.map(text => element('li', text)));
  }
  document.querySelectorAll('[data-action]').forEach(button => button.addEventListener('click', () => dispatch({ type: button.dataset.action })));
  $('clear-mode').addEventListener('click', () => { clearMode = !clearMode; render(); announce($('selection-help').textContent); });
  $('accept-care').addEventListener('click', () => dispatch({ type: 'respond', accept: true }));
  $('decline-care').addEventListener('click', () => dispatch({ type: 'respond', accept: false }));
  $('undo').addEventListener('click', () => {
    if (!history.length) return;
    state = history.pop(); clearMode = false; render(); announce('Last action undone. ' + $('turn').textContent);
    if (state.pending) $('consent-title').focus();
  });
  function savedStatus() {
    try { const saved = localStorage.getItem(KEY); $('resume').disabled = !saved; $('erase-save').disabled = !saved; return saved; }
    catch { $('resume').disabled = true; $('erase-save').disabled = true; $('save-status').textContent = 'Device storage is unavailable. You can still play and undo in this session.'; return null; }
  }
  $('save').addEventListener('click', () => {
    if (state.pending) return;
    try { localStorage.setItem(KEY, JSON.stringify(state)); $('save-status').textContent = 'Game saved on this device. Future actions are not saved automatically.'; savedStatus(); announce('Game saved on this device.'); }
    catch { $('save-status').textContent = 'Saving failed. Device storage may be unavailable or full. Your current game is still here.'; announce($('save-status').textContent); }
  });
  function replacementDialog(saved) {
    resumeState = saved;
    $('restart-title').textContent = saved ? 'Resume the saved game?' : 'Start a new game?';
    $('confirm-restart').textContent = saved ? 'Resume saved game' : 'Start new game';
    $('restart-dialog').showModal();
  }
  $('restart').addEventListener('click', () => replacementDialog(null));
  $('resume').addEventListener('click', () => {
    const raw = savedStatus(); if (!raw) return;
    const saved = E.restore(raw);
    if (!saved) { $('save-status').textContent = 'This save is invalid or from an incompatible version. Delete it to start fresh.'; announce($('save-status').textContent); return; }
    replacementDialog(saved);
  });
  $('confirm-restart').addEventListener('click', () => {
    state = resumeState || E.initial(); history = []; clearMode = false; focused = state.players[state.active].position;
    $('restart-dialog').close(); render(); announce('Session ready. ' + $('turn').textContent);
    if (state.pending) $('consent-title').focus(); else if (state.outcome) $('ending-title').focus(); else cells[focused].focus();
  });
  $('cancel-restart').addEventListener('click', () => $('restart-dialog').close());
  $('erase-save').addEventListener('click', () => {
    try { localStorage.removeItem(KEY); savedStatus(); $('save-status').textContent = 'Device save deleted. Your current session is still here.'; announce($('save-status').textContent); }
    catch { announce('Device save could not be deleted because storage is unavailable.'); }
  });
  $('board-title').tabIndex = -1;
  render(); savedStatus();
})();
