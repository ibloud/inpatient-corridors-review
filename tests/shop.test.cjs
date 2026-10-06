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
test('Mortis breathing can be paused and resumed without moving focus', () => {
  const dom = page(), d = dom.window.document, button = d.getElementById('sigil-pause');
  assert.equal(button.hidden, false);
  assert.equal(d.getElementById('mortis-sigil').getAttribute('role'), 'img');
  button.focus(); button.click();
  assert.equal(button.getAttribute('aria-pressed'), 'true');
  assert.equal(button.textContent, 'Resume breathing');
  assert.equal(d.getElementById('mortis-sigil').classList.contains('paused'), true);
  assert.equal(d.activeElement, button);
  button.click();
  assert.equal(button.getAttribute('aria-pressed'), 'false');
  assert.equal(d.getElementById('mortis-sigil').classList.contains('paused'), false);
  dom.window.close();
});
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
  assert.equal(schema.mainEntity.itemListElement.length, d.querySelectorAll('[data-store] .product').length);
  dom.window.close();
});
test('search handles mixed case, no matches, and clearing with focus restored', () => {
  const dom = page(), w = dom.window, d = w.document, input = d.getElementById('product-search');
  input.value = '  FINAL THOUGHTS  '; input.dispatchEvent(new w.Event('input'));
  assert.equal(d.querySelectorAll('[data-store] .product:not([hidden])').length, 1);
  input.value = 'no-such-product-xyz'; input.dispatchEvent(new w.Event('input'));
  assert.equal(d.getElementById('catalog-empty').hidden, false);
  d.getElementById('search-clear').click();
  assert.equal(d.getElementById('catalog-empty').hidden, true);
  assert.equal(d.querySelectorAll('[data-store] .product[hidden]').length, 0);
  assert.equal(d.activeElement, input);
  dom.window.close();
});
test('official artist cards are visible outside the archive and search across stores', () => {
  const dom = page(), w = dom.window, d = w.document;
  for (const [store, host] of [['webby','merch.chriswebby.com'],['ren','renmakesmerch.com']]) {
    const section = d.querySelector(`[data-store="${store}"]`);
    assert.equal(section.closest('details'), null);
    for (const link of section.querySelectorAll('.product a')) assert.equal(new URL(link.href).hostname, host);
    for (const image of section.querySelectorAll('.product img')) assert.equal(new URL(image.src).hostname, 'cdn.shopify.com');
  }
  assert.ok([...d.querySelectorAll('[data-store="ren"] .availability')].some(p=>p.textContent.startsWith('Sold out')));
  const input = d.getElementById('product-search');
  input.value = 'asylum'; input.dispatchEvent(new w.Event('input'));
  assert.ok(d.querySelectorAll('[data-store="ren"] .product:not([hidden])').length > 0);
  assert.equal(d.querySelectorAll('#catalog .product:not([hidden])').length, 0);
  dom.window.close();
});
test('live Like Father journal stays separate from Dallas XY and design studies', () => {
  const dom = page(), d = dom.window.document;
  const ghost = d.getElementById('like-father-like-ghost');
  assert.equal(ghost.closest('details'), null);
  assert.ok(ghost.querySelector('a.buy[href$="/final-thoughts"]'));
  assert.equal(d.getElementById('dallas-xy').querySelector('a[href$="/final-thoughts"]'), null);
  assert.equal(d.getElementById('mortis-products').querySelector('a[href$="/final-thoughts"]'), null);
  assert.doesNotMatch(ghost.textContent, /not for sale|not current store listings/);
  assert.equal(d.querySelector('#artwork-studies .book'), null);
  const urls = [...d.querySelectorAll('#catalog .product')].map(card=>card.dataset.productUrl);
  assert.equal(new Set(urls).size, urls.length);
  const input=d.getElementById('product-search');
  input.value='Like Father'; input.dispatchEvent(new dom.window.Event('input'));
  assert.equal(d.querySelectorAll('#catalog .product:not([hidden])').length, 1);
  assert.ok(ghost.querySelector('.product:not([hidden])'));
  dom.window.close();
});
