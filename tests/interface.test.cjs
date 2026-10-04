const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const url = 'https://ibloud.github.io/inpatient-corridors-review/';
function page(p) { return new JSDOM(read(p), { url: url + p, runScripts: 'outside-only' }); }
test('homepage has distinct working rules, story and review entries before historical context', () => {
  const { document: d } = page('index.html').window;
  assert.deepEqual([...d.querySelectorAll('.start-card')].map(a => a.getAttribute('href')), ['VARIANT-RULES.html', 'interactive/yellow-door/docs/', 'review/']);
  assert.equal(d.querySelector('iframe').closest('details').id, 'writing');
  for (const a of d.querySelectorAll('a[href^="#"]')) assert.ok(d.getElementById(a.hash.slice(1)), a.href);
});
test('PIXIE resolves local navigation consistently from nested pages, opens once and restores focus', () => {
  for (const relative of ['index.html', 'review/index.html', 'interactive/yellow-door/docs/index.html']) {
    const dom = new JSDOM(`<button id="prior">Before</button><script src="${url}assets/pixie.js"></script>`, { url: url + relative, runScripts: 'outside-only' });
    const { window: w } = dom, d = w.document;
    Object.defineProperty(d, 'currentScript', { value: d.querySelector('script') });
    w.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
    w.HTMLDialogElement.prototype.close = function () { this.open = false; this.dispatchEvent(new w.Event('close')); };
    w.eval(read('assets/pixie.js'));
    w.eval(read('assets/pixie.js'));
    assert.equal(d.querySelectorAll('#pixie-open').length, 1);
    assert.equal(d.querySelectorAll('#pixie-panel').length, 1);
    const b = d.getElementById('pixie-open'); b.focus(); b.click();
    assert.equal(d.querySelector('dialog').open, true);
    assert.equal(d.activeElement.id, 'pixie-close');
    assert.equal(b.getAttribute('aria-expanded'), 'true');
    const links = [...d.querySelectorAll('.pixie-grid a')].map(a => a.href);
    assert.ok(links.includes(url + 'VARIANT-RULES.html'));
    assert.ok(links.includes(url + 'RIGHTS-AND-SAFETY.html'));
    d.getElementById('pixie-close').click();
    assert.equal(d.querySelector('dialog').open, false);
    assert.equal(d.activeElement, b);
    assert.equal(b.getAttribute('aria-expanded'), 'false');
    dom.window.close();
  }
});
test('all review routes focus their heading, expose selection, and keep feedback on route changes', () => {
  const dom = page('review/index.html'), w = dom.window, d = w.document;
  for (const script of d.querySelectorAll('script:not([src])')) w.eval(script.textContent);
  d.getElementById('observe').value = 'A test observation';
  for (const button of d.querySelectorAll('.choice')) {
    button.click();
    assert.equal(d.activeElement.id, 'routeTitle');
    assert.equal(d.querySelectorAll('.choice[aria-pressed="true"]').length, 1);
    assert.equal(button.getAttribute('aria-pressed'), 'true');
    assert.equal(d.getElementById('observe').value, 'A test observation');
    for (const a of d.querySelectorAll('#routeCards a')) {
      const local = new URL(a.href).pathname.replace('/inpatient-corridors-review/', '');
      assert.ok(fs.existsSync(path.join(root, local)), a.href);
      assert.ok(!local.endsWith('.md'), a.href);
    }
  }
  d.getElementById('reset').click();
  assert.equal(d.querySelectorAll('.choice[aria-pressed="true"]').length, 0);
  assert.equal(d.activeElement, d.querySelector('.choice'));
  assert.equal(d.getElementById('observe').value, 'A test observation');
  dom.window.close();
});
test('copy reviews sends only requested text to the clipboard and announces failure', async () => {
  const dom = page('review/index.html'), w = dom.window, d = w.document;
  for (const script of d.querySelectorAll('script:not([src])')) w.eval(script.textContent);
  let copied;
  Object.defineProperty(w.navigator, 'clipboard', { value: { writeText: async text => { copied = text; } } });
  d.querySelector('[data-lane="access"]').click(); d.getElementById('observe').value = 'Keyboard test';
  d.getElementById('copy').click(); await new Promise(resolve => setImmediate(resolve));
  assert.match(copied, /Route: Accessibility/); assert.match(copied, /Keyboard test/);
  w.navigator.clipboard.writeText = async () => { throw new Error('denied'); };
  d.getElementById('copy').click(); await new Promise(resolve => setImmediate(resolve));
  assert.match(d.getElementById('status').textContent, /Select and copy/);
  dom.window.close();
});
for (const name of ['VARIANT-RULES', 'REVIEW-DECISION', 'CHRIS-WEBBY-DISCOGRAPHY-LENS', 'STATUS-AND-PROVENANCE', 'THE-ASK', 'AWARD-STRATEGY', 'RIGHTS-AND-SAFETY', 'ORIGINAL-VARIANT-CONCEPT', 'PROJECT-BRIEF', 'PROTOTYPE-ASSESSMENT']) {
  test(name + ' remains on-site with a readable document and PIXIE', () => {
    const dom = page(name + '.html'), d = dom.window.document;
    assert.equal(d.querySelector('meta[http-equiv="refresh"]'), null);
    assert.equal(d.querySelectorAll('h1').length, 1);
    assert.ok(d.querySelector('main article').textContent.length > 100);
    assert.equal(d.querySelector('script[src]').getAttribute('src'), 'assets/pixie.js');
    for (const a of d.querySelectorAll('a[href^="#"]')) assert.ok(d.getElementById(a.hash.slice(1)), a.href);
    dom.window.close();
  });
}
