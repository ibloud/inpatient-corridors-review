const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {JSDOM} = require('jsdom');
const source = fs.readFileSync(path.resolve(__dirname, '../shop/index.html'), 'utf8');
function page() {
  const dom = new JSDOM(source, {runScripts:'outside-only'});
  for (const script of dom.window.document.querySelectorAll('script:not([src]):not([type])')) dom.window.eval(script.textContent);
  return dom;
}
test('catalog links to existing Squarespace products, with concepts kept in the archive', () => {
  const dom = page(), d = dom.window.document;
  const cards = [...d.querySelectorAll('#catalog .product')];
  assert.ok(cards.length > 0);
  assert.equal(d.querySelector('details.archive').open, false);
  for (const card of cards) {
    for (const a of card.querySelectorAll('a')) {
      const u = new URL(a.href);
      assert.equal(u.origin, 'https://www.daddyslittlemortis.com');
      assert.ok(u.pathname.startsWith('/shop/p/'));
    }
    assert.equal(new URL(card.querySelector('img').src).hostname, 'images.squarespace-cdn.com');
  }
  const schema = JSON.parse(d.querySelector('script[type="application/ld+json"]').textContent);
  assert.equal(schema.mainEntity.itemListElement.length, cards.length);
  dom.window.close();
});
test('search handles mixed case, no matches, and clearing with focus restored', () => {
  const dom = page(), w = dom.window, d = w.document, input = d.getElementById('product-search');
  input.value = '  FINAL THOUGHTS  '; input.dispatchEvent(new w.Event('input'));
  assert.equal(d.querySelectorAll('#catalog .product:not([hidden])').length, 1);
  input.value = 'no-such-product-xyz'; input.dispatchEvent(new w.Event('input'));
  assert.equal(d.getElementById('catalog-empty').hidden, false);
  d.getElementById('search-clear').click();
  assert.equal(d.getElementById('catalog-empty').hidden, true);
  assert.equal(d.querySelectorAll('#catalog .product[hidden]').length, 0);
  assert.equal(d.activeElement, input);
  dom.window.close();
});
