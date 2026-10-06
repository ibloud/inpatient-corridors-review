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
  const products = catalog.items.filter(item => item.recordType === 11).map(item => {
    const url = new URL(item.fullUrl, origin);
    const image = new URL(item.items?.[0]?.assetUrl || item.assetUrl);
    if (url.origin !== origin || !url.pathname.startsWith('/shop/p/') || image.hostname !== 'images.squarespace-cdn.com' || image.protocol !== 'https:') throw new Error('Unexpected product URL');
    return {name: item.title.replace(/\*\*/g, ''), url: url.href, image: image.href};
  });
  if (!products.length) throw new Error('No products in catalog');
  const cards = products.map(p => `<article class="card product"><a class="art" href="${escape(p.url)}"><img src="${escape(p.image)}?format=750w" alt="${escape(p.name)}" loading="lazy" width="750" height="750"></a><div class="details"><h3>${escape(p.name)}</h3><a class="buy" href="${escape(p.url)}">View in Daddy’s Little Mortis →</a></div></article>`).join('\n');
  const schema = JSON.stringify({'@context':'https://schema.org', '@type':'CollectionPage', name:'Daddy’s Little Mortis — Shop', url:'https://ibloud.github.io/inpatient-corridors-review/shop/', description:'Browse the existing Daddy’s Little Mortis collection. Choose options and complete your purchase in the Squarespace store.', mainEntity:{'@type':'ItemList', itemListElement:products.map((p,i)=>({'@type':'ListItem', position:i+1, name:p.name, url:p.url}))}}).replace(/</g,'\\u003c');
  let html = fs.readFileSync(target, 'utf8');
  const replace = (label, content) => {
    const start = `<!-- ${label}:start -->`, end = `<!-- ${label}:end -->`;
    if (html.split(start).length !== 2 || html.split(end).length !== 2) throw new Error('Missing catalog markers: ' + label);
    html = html.slice(0, html.indexOf(start) + start.length) + '\n' + content + '\n' + html.slice(html.indexOf(end));
  };
  replace('catalog', cards);
  replace('catalog-schema', `<script type="application/ld+json">${schema}</script>`);
  fs.writeFileSync(target, html);
  console.log(`Refreshed ${products.length} existing Squarespace products`);
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
