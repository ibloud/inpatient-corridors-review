const fs = require('node:fs');
const path = require('node:path');
const MarkdownIt = require('markdown-it');
const root = path.resolve(__dirname, '..');
const documents = ['VARIANT-RULES', 'REVIEW-DECISION', 'CHRIS-WEBBY-DISCOGRAPHY-LENS', 'STATUS-AND-PROVENANCE', 'THE-ASK', 'AWARD-STRATEGY', 'RIGHTS-AND-SAFETY', 'ORIGINAL-VARIANT-CONCEPT', 'PROJECT-BRIEF', 'PROTOTYPE-ASSESSMENT'];
const md = new MarkdownIt({ html: false });
const escape = value => md.utils.escapeHtml(value);
let failed = false;
for (const name of documents) {
  const source = fs.readFileSync(path.join(root, name + '.md'), 'utf8');
  const title = source.split('\n').find(line => line.startsWith('# ')).slice(2);
  const tokens = md.parse(source, {});
  const sections = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === 'heading_open' && token.tag === 'h2') {
      const id = 'section-' + (sections.length + 1);
      token.attrSet('id', id);
      sections.push({ id, title: tokens[i + 1].content });
    }
    for (const child of token.children || []) {
      if (child.type !== 'link_open') continue;
      const href = child.attrGet('href');
      const match = href && href.match(/^(?:\.\/)?([A-Z0-9-]+)\.md(#.*)?$/);
      if (match && documents.includes(match[1]) && !match[2]) child.attrSet('href', match[1] + '.html');
      else if (match) child.attrSet('href', 'https://github.com/ibloud/inpatient-corridors-review/blob/main/' + href);
    }
  }
  const body = md.renderer.render(tokens, md.options, {});
  const toc = sections.length ? `<details class="document-toc"><summary>On this page</summary><ul>${sections.map(s => `<li><a href="#${s.id}">${escape(s.title)}</a></li>`).join('')}</ul></details>` : '';
  const output = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escape(title)} — Break the Grid</title>
<link rel="stylesheet" href="assets/interface.css"><script defer src="assets/pixie.js?v=20261004-2"></script></head>
<body class="document-page"><a class="skip-link" href="#main">Skip to main content</a>
<nav class="return-nav" aria-label="Project navigation"><a href="./">← Break the Grid</a><a href="review/">Guided review</a><a href="STATUS-AND-PROVENANCE.html">Status &amp; provenance</a></nav>
<main id="main" class="document-content" tabindex="-1"><p class="document-label">Project record · Inpatient Corridors</p>
${toc}
<article>${body}</article>
<footer><a href="https://github.com/ibloud/inpatient-corridors-review/blob/main/${name}.md">Read the Markdown source</a> · <a href="./#archive">All project documents</a></footer>
</main></body></html>
`;
  const target = path.join(root, name + '.html');
  if (process.argv.includes('--check')) {
    if (fs.readFileSync(target, 'utf8') !== output) { console.error(name + '.html is out of date'); failed = true; }
  } else fs.writeFileSync(target, output);
}
if (failed) process.exitCode = 1;
