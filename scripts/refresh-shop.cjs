// Read the existing public Squarespace catalog. No account keys or cart are used.
const fs = require('node:fs');
const path = require('node:path');
const origin = 'https://www.daddyslittlemortis.com';
const target = path.resolve(__dirname, '../shop/index.html');
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
async function main() {
  const source = process.argv.indexOf('--source');
  let catalog;
  if (source !== -1) catalog = JSON.parse(fs.readFileSync(process.argv[source + 1], 'utf8'));
  else {
    const response = await fetch(origin + '/shop?format=json', {signal: AbortSignal.timeout(30000)});
    if (!response.ok) throw new Error('Catalog returned HTTP ' + response.status);
    catalog = await response.json();
  }
  if (catalog.website?.id !== '69d3e5e9fada8c60edd68c32' || !Array.isArray(catalog.items) || !catalog.items.length) throw new Error('Unexpected or empty catalog');
  const categories = new Map((catalog.nestedCategories?.categories || []).map(c => [c.id, c.shortSlug]));
  const products = catalog.items.filter(item => item.recordType === 11).map(item => {
    const url = new URL(item.fullUrl, origin);
    const image = new URL(item.items?.[0]?.assetUrl || item.assetUrl);
    if (url.origin !== origin || !url.pathname.startsWith('/shop/p/') || image.hostname !== 'images.squarespace-cdn.com' || image.protocol !== 'https:') throw new Error('Unexpected product URL');
    return {id:item.id, name: item.title.replace(/\*\*/g, ''), url: url.href, image: image.href, categories:(item.categoryIds || []).map(id=>categories.get(id)).filter(Boolean)};
  });
  if (!products.length) throw new Error('No products in catalog');
  const artistSource = process.argv.indexOf('--artist-source-dir');
  async function artistCatalog(store, collection, file) {
    let data;
    if (artistSource !== -1) data = JSON.parse(fs.readFileSync(path.join(process.argv[artistSource + 1], file), 'utf8'));
    else {
      const response = await fetch(store + '/collections/' + collection + '/products.json?limit=100', {signal: AbortSignal.timeout(30000)});
      if (!response.ok) throw new Error('Official artist catalog returned HTTP ' + response.status);
      data = await response.json();
    }
    if (!Array.isArray(data.products) || !data.products.length) throw new Error('Empty official artist catalog');
    return data.products.map(p => {
      if (!/^[a-z0-9-]+$/.test(p.handle)) throw new Error('Invalid official product handle');
      const image = new URL(p.images?.[0]?.src);
      if (image.hostname !== 'cdn.shopify.com' || image.protocol !== 'https:') throw new Error('Invalid official product image');
      return {name:p.title, url:store + '/products/' + p.handle, image:image.href, available:p.variants.some(v=>v.available === true)};
    });
  }
  const [webby, jerseys, ren] = await Promise.all([
    artistCatalog('https://merch.chriswebby.com', 'inpatient', 'webby-inpatient.json'),
    artistCatalog('https://merch.chriswebby.com', 'jerseys', 'webby-jerseys.json'),
    artistCatalog('https://renmakesmerch.com', 'inpatient-asylum', 'ren-inpatient.json')
  ]);
  const artistCards = (items, owner) => items.map(p => `<article class="card product"><a class="art" href="${escape(p.url)}"><img src="${escape(p.image)}" alt="${escape(p.name)}" loading="lazy" width="750" height="750"></a><div class="details"><h3 class="product-name">${escape(p.name)}</h3><p class="availability">${p.available ? 'Listed as available' : 'Sold out'} · checked ${new Date().toISOString().slice(0,10)}</p><a class="buy" href="${escape(p.url)}">View in ${escape(owner)}’s official store →</a></div></article>`).join('\n');
  const card = p => `<article class="card product" data-product-url="${escape(p.url)}"><a class="art" href="${escape(p.url)}"><img src="${escape(p.image)}?format=750w" alt="${escape(p.name)}" loading="lazy" width="750" height="750"></a><div class="details"><h4 class="product-name">${escape(p.name)}</h4><a class="buy" href="${escape(p.url)}">View in Daddy’s Little Mortis →</a></div></article>`;
  // Verified 2026-10-06 on the live Final Thoughts product page: the journal
  // visibly carries the Like Father, Like Ghost artwork despite its broad store category.
  const isLikeFather = p => p.id === '69de4dda0943f735c5992ada' || p.categories.includes('like-father-like-ghost');
  const groups = [
    {id:'like-father-like-ghost', name:'Like Father, Like Ghost', description:'Live in our existing Squarespace store. Final Thoughts is the spiral-bound journal featuring the commissioned skull-and-title artwork.', url:origin+'/shop/p/final-thoughts', items:products.filter(isLikeFather)},
    {id:'dallas-xy', name:'Dallas XY', description:'Our Pennywise variant and an example of building an experience around a television-show spoof and a parody AI content creator who went viral.', url:origin+'/shop/dallas-xy', items:products.filter(p=>p.categories.includes('dallas-xy'))},
    {id:'mortis-products', name:'Daddy’s Little Mortis', description:'Additional items from our existing store.', url:origin+'/shop/daddys-little-mortis', items:products.filter(p=>!isLikeFather(p) && !p.categories.includes('dallas-xy') && p.categories.includes('daddys-little-mortis'))},
    {id:'other-products', name:'Other store items', description:'Additional store listings.', url:origin+'/shop', items:products.filter(p=>!isLikeFather(p) && !p.categories.includes('dallas-xy') && !p.categories.includes('daddys-little-mortis'))}
  ];
  const cards = groups.filter(group=>group.items.length).map(group=>`<section class="catalog-collection" id="${group.id}" aria-labelledby="${group.id}-title"><h3 id="${group.id}-title">${group.name}</h3><p class="status">${group.description}</p><p><a href="${group.url}">View this collection in the store →</a></p><div class="grid catalog-grid">${group.items.map(card).join('\n')}</div></section>`).join('\n');
  const listedProducts = [...products, ...webby, ...jerseys.slice(0,3), ...ren];
  const schema = JSON.stringify({'@context':'https://schema.org', '@type':'CollectionPage', name:'Daddy’s Little Mortis & Official Inpatient Merchandise', url:'https://ibloud.github.io/inpatient-corridors-review/shop/', description:'Browse Daddy’s Little Mortis and selected official Inpatient merchandise from Chris Webby and Ren. Purchases happen in each seller’s store.', mainEntity:{'@type':'ItemList', itemListElement:listedProducts.map((p,i)=>({'@type':'ListItem', position:i+1, name:p.name, url:p.url}))}}).replace(/</g,'\\u003c');
  let html = fs.readFileSync(target, 'utf8');
  const replace = (label, content) => {
    const start = `<!-- ${label}:start -->`, end = `<!-- ${label}:end -->`;
    if (html.split(start).length !== 2 || html.split(end).length !== 2) throw new Error('Missing catalog markers: ' + label);
    html = html.slice(0, html.indexOf(start) + start.length) + '\n' + content + '\n' + html.slice(html.indexOf(end));
  };
  replace('catalog', cards);
  replace('webby-catalog', artistCards(webby, 'Webby'));
  replace('webby-jerseys', artistCards(jerseys.slice(0,3), 'Webby'));
  replace('ren-catalog', artistCards(ren, 'Ren'));
  replace('catalog-schema', `<script type="application/ld+json">${schema}</script>`);
  fs.writeFileSync(target, html);
  console.log(`Refreshed ${products.length} Mortis products, ${webby.length} Webby Inpatient items, 3 Webby jerseys, and ${ren.length} Ren items`);
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
