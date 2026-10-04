const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const E = require('../corridors/engine.js');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const move = cell => ({ type: 'move', cell });
const fund = id => ({ type: 'fund', id });
const gather = { type: 'gather' };
const win = [move(1), move(0), move(23), move(24), fund('peer'), fund('peer'), fund('housing'), fund('housing'), gather, fund('housing'), gather, fund('mobile'), fund('mobile'), fund('mobile'), fund('creative'), fund('creative')];
function step(s, action) { const r = E.act(s, action); assert.equal(r.ok, true, r.error); assert.ok(E.valid(r.state)); return r.state; }
test('complete legal cooperative game reaches Continuum before round-end Pressure', () => {
  let s = E.initial(); for (const a of win) s = step(s, a);
  assert.equal(s.outcome, 'continuum'); assert.equal(s.pressure, 3); assert.equal(s.round, 4);
  assert.deepEqual(s.players.map(p => p.position), [0, 24]);
  assert.equal(E.act(s, gather).ok, false);
});
test('invalid movement and unknown actions consume no resources and do not mutate input', () => {
  const s = E.initial(), original = JSON.stringify(s);
  for (const action of [move(12), move(24), move(-1), move(1.5), { type: 'respond', accept: true }, fund('unknown')]) assert.equal(E.act(s, action).ok, false);
  assert.equal(JSON.stringify(s), original);
  const blocked = E.initial(); blocked.barriers = [7]; assert.equal(E.act(blocked, move(7)).ok, false);
});
test('two actions per player and deterministic barriers; collapse prevents further actions', () => {
  let s = E.initial(); const rest = { type: 'rest' };
  s = step(s, rest); assert.equal(s.active, 0); assert.equal(s.actions, 1);
  s = step(s, rest); assert.equal(s.active, 1); assert.equal(s.pressure, 3);
  s = step(step(s, rest), rest); assert.equal(s.round, 2); assert.equal(s.pressure, 4); assert.deepEqual(s.barriers, [7]);
  while (!s.outcome) s = step(s, rest);
  assert.equal(s.outcome, 'collapse'); assert.equal(s.pressure, 10);
  assert.ok(s.barriers.every(c => !E.EXITS.includes(c) && c !== E.VOID && !s.players.some(p => p.position === c)));
});
test('consent waits for an explicit response and makes decline resource-neutral', () => {
  const s = E.initial(); s.care.clinical = 3; s.players[1].tension = 5;
  const pending = step(s, { type: 'care' });
  assert.equal(pending.actions, 2); assert.equal(pending.players[0].support, 2);
  assert.equal(E.act(pending, gather).ok, false); assert.equal(E.act(pending, { type: 'respond', accept: 'yes' }).ok, false);
  const no = step(pending, { type: 'respond', accept: false });
  assert.equal(no.players[0].support, 2); assert.equal(no.players[1].tension, 5); assert.equal(no.actions, 1); assert.equal(no.pending, null);
  const yes = step(pending, { type: 'respond', accept: true });
  assert.equal(yes.players[0].support, 1); assert.equal(yes.players[1].tension, 1); assert.equal(yes.actions, 1);
});
test('Care completion effects happen once; barrier removal and travel have explicit costs', () => {
  let s = E.initial(); s.care.housing = 2; s.barriers = [7, 17, 11];
  s = step(s, fund('housing')); assert.equal(s.pressure, 2); assert.deepEqual(s.barriers, [11]);
  assert.equal(E.act(s, fund('housing')).ok, false);
  let clear = E.initial(); clear.barriers = [7];
  clear = step(clear, { type: 'clear', cell: 7 }); assert.equal(clear.players[0].support, 0); assert.deepEqual(clear.barriers, []);
  let travel = E.initial(); assert.equal(E.act(travel, { type: 'travel', cell: 0 }).ok, false);
  travel.care.transport = 2; travel = step(travel, { type: 'travel', cell: 0 }); assert.equal(travel.players[0].support, 1); assert.equal(travel.players[0].position, 0);
});
test('Tension threshold occurs at turn start, and Creative Space prevents Gather tension', () => {
  let s = E.initial(); s.players[1].tension = 6;
  s = step(step(s, gather), gather); assert.equal(s.active, 1); assert.equal(s.players[1].tension, 4); assert.equal(s.pressure, 4);
  s.care.creative = 2; const prior = s.players[1].tension;
  s = step(s, gather); assert.equal(s.players[1].tension, prior);
});
test('restore rejects incompatible/corrupt saves and strips unrelated fields', () => {
  for (const raw of ['bad', '{}', 'null', JSON.stringify({ ...E.initial(), version: 900 }), JSON.stringify({ ...E.initial(), barriers: [12] }), JSON.stringify({ ...E.initial(), actions: 0 }), JSON.stringify({ ...E.initial(), pressure: 10 })]) assert.equal(E.restore(raw), null);
  const s = E.initial(); s.personal = 'private'; s.players[0].name = 'private';
  const clean = E.restore(JSON.stringify(s)); assert.ok(clean); assert.equal(clean.personal, undefined); assert.equal(clean.players[0].name, undefined);
});
function ui() {
  const dom = new JSDOM(read('corridors/index.html'), { url: 'https://ibloud.github.io/inpatient-corridors-review/corridors/', runScripts: 'outside-only' });
  const w = dom.window;
  w.Corridors = E;
  w.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  w.HTMLDialogElement.prototype.close = function () { this.open = false; };
  w.eval(read('corridors/app.js'));
  return { w, d: w.document, click: id => w.document.getElementById(id).click() };
}
test('keyboard board has one tab stop, arrows explore without taking a game action', () => {
  const { w, d } = ui(), cells = [...d.querySelectorAll('.cell')];
  assert.equal(cells.filter(b => b.tabIndex === 0).length, 1); cells[2].focus();
  for (const [cell, key] of [[2, 'ArrowUp'], [22, 'ArrowDown'], [0, 'ArrowLeft'], [4, 'ArrowRight']]) { cells[cell].focus(); cells[cell].dispatchEvent(new w.KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })); assert.equal(d.activeElement, cells[cell]); }
  cells[2].focus();
  cells[2].dispatchEvent(new w.KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true }));
  assert.equal(d.activeElement, cells[1]); assert.equal(cells.filter(b => b.tabIndex === 0).length, 1);
  assert.match(d.getElementById('turn').textContent, /2 actions/); cells[1].click(); assert.match(d.getElementById('turn').textContent, /1 action/);
});
test('save is explicit, Undo restores state, resume and restart require confirmation', () => {
  const { w, d, click } = ui(); const key = 'loptr.corridors.cooperative.v1';
  assert.equal(w.localStorage.getItem(key), null);
  d.querySelector('[data-action="gather"]').click(); click('save');
  assert.equal(JSON.parse(w.localStorage.getItem(key)).players[0].support, 4);
  click('undo'); assert.match(d.getElementById('player-status').textContent, /Support 2/);
  click('resume'); assert.equal(d.getElementById('restart-dialog').open, true);
  assert.match(d.getElementById('player-status').textContent, /Support 2/);
  click('confirm-restart'); assert.match(d.getElementById('player-status').textContent, /Support 4/);
  click('restart'); click('cancel-restart'); assert.match(d.getElementById('player-status').textContent, /Support 4/);
  click('restart'); click('confirm-restart'); assert.match(d.getElementById('player-status').textContent, /Support 2/);
  assert.ok(w.localStorage.getItem(key)); click('erase-save'); assert.equal(w.localStorage.getItem(key), null);
});
test('UI handles invalid and unavailable storage, and never interprets stored log markup', () => {
  const { w, d, click } = ui(); const key = 'loptr.corridors.cooperative.v1';
  w.localStorage.setItem(key, '{}'); click('save'); w.localStorage.setItem(key, '{}'); click('resume');
  assert.match(d.getElementById('save-status').textContent, /invalid/);
  const s = E.initial(); s.log = ['<img src=x onerror=alert(1)>']; w.localStorage.setItem(key, JSON.stringify(s));
  click('resume'); click('confirm-restart'); assert.equal(d.querySelector('#event-log img'), null); assert.match(d.getElementById('event-log').textContent, /<img/);
  w.Storage.prototype.setItem = function () { throw new Error('storage blocked'); }; click('save'); assert.match(d.getElementById('save-status').textContent, /Saving failed/);
});
test('UI consent handoff disables actions and save; refusal consumes only the asking action', () => {
  const { w, d, click } = ui(), s = E.initial(); s.care.clinical = 3; s.players[1].tension = 4;
  w.localStorage.setItem('loptr.corridors.cooperative.v1', JSON.stringify(s)); click('save');
  w.localStorage.setItem('loptr.corridors.cooperative.v1', JSON.stringify(s)); click('resume'); click('confirm-restart'); click('request-care');
  assert.equal(d.activeElement.id, 'consent-title'); assert.equal(d.getElementById('save').disabled, true);
  assert.equal(d.querySelector('[data-action="gather"]').disabled, true); assert.equal(d.getElementById('consent-panel').hidden, false);
  click('decline-care'); assert.equal(d.getElementById('consent-panel').hidden, true); assert.match(d.getElementById('turn').textContent, /1 action/); assert.match(d.getElementById('player-status').textContent, /Tension 4/);
});
test('complete game through UI displays shared ending and Undo can reopen it', () => {
  const { d, click } = ui();
  for (const a of win) {
    if (a.type === 'move') d.querySelectorAll('.cell')[a.cell].click();
    else if (a.type === 'gather') d.querySelector('[data-action="gather"]').click();
    else d.querySelectorAll('.care-card')[E.CARE.findIndex(c => c.id === a.id)].querySelector('button').click();
  }
  assert.equal(d.getElementById('ending').hidden, false); assert.match(d.getElementById('ending-title').textContent, /Continuum/);
  assert.equal(d.querySelector('[data-action="gather"]').disabled, true); assert.equal(d.activeElement.id, 'ending-title');
  click('undo'); assert.equal(d.getElementById('ending').hidden, true); assert.equal(d.querySelector('[data-action="gather"]').disabled, false);
});
