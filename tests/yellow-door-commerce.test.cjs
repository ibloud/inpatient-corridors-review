const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const {JSDOM} = require('jsdom');
const base = 'interactive/yellow-door/';
const read = p => fs.readFileSync(base+p, 'utf8');
function boot() {
  const dom = new JSDOM(read('docs/index.html'), {url:'https://ibloud.github.io/inpatient-corridors-review/interactive/yellow-door/docs/', runScripts:'outside-only'});
  const w = dom.window;
  w.matchMedia = () => ({matches:false});
  w.HTMLElement.prototype.scrollTo = w.HTMLElement.prototype.scrollBy = () => {};
  w.HTMLDialogElement.prototype.showModal = function(){this.open=true;};
  w.HTMLDialogElement.prototype.close = function(){this.open=false;this.dispatchEvent(new w.Event('close'));};
  w.fetch = async () => ({ok:true,text:async()=>read('story/yellow-door-alpha.json')});
  w.eval(read('docs/vendor/ink.js'));
  w.eval(read('docs/app.js'));
  return dom;
}
test('credits preview is visible outside the setup disclosure and preserves the story', () => {
  const dom=boot(), w=dom.window, d=w.document;
  const button=d.getElementById('preview-products');
  assert.equal(button.closest('section').id,'credits');
  assert.equal(button.closest('details'),null);
  const before=d.getElementById('game').innerHTML;
  button.click();
  assert.equal(d.getElementById('product-preview').open,true);
  const links=[...d.querySelectorAll('#preview-product-cards .product-cart-link')];
  assert.deepEqual(links.map(a=>a.href),[
    'https://renmakesmerch.com/cart/56183455875445:1?storefront=true',
    'https://theskinnerbrothers.com/cart/49887103320341:1?storefront=true'
  ]);
  for(const a of links){assert.equal(a.target,'_blank');assert.match(a.rel,/noopener/);}
  assert.equal(d.querySelectorAll('#preview-product-cards a[href*="/products/"]').length,2);
  d.getElementById('close-product-preview').click();
  assert.equal(d.getElementById('product-preview').open,false);
  assert.equal(d.activeElement,button);
  assert.equal(d.getElementById('game').innerHTML,before);
  assert.equal(d.querySelectorAll('#story .product-cart-link').length,0);
  dom.window.close();
});
test('a real Ink ending offers both products only after the optional-page choice',async()=>{
  const dom=boot(),w=dom.window,d=w.document;
  d.querySelector('#choices button:last-child').click();
  await new Promise(resolve=>setImmediate(resolve));
  assert.ok(d.querySelector('.story-line'));
  let count=0;
  while(!d.querySelector('#choices').textContent.includes('Open optional music and video page')){
    assert.equal(d.querySelectorAll('#story .product-cart-link').length,0);
    const b=d.querySelector('#choices button');assert.ok(b);
    b.click();assert.ok(++count<100,'Story should reach an ending');
  }
  assert.equal(d.querySelectorAll('#story .product-cart-link').length,0);
  d.querySelector('#choices button').click();
  assert.equal(d.querySelectorAll('#story .product-cart-link').length,2);
  assert.equal(d.getElementById('error').hidden,true);
  dom.window.close();
});
