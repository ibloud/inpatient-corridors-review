(()=>{if(document.getElementById("pixie-open"))return;const s=document.currentScript;const css=`
.pixie-button{position:fixed;right:max(16px,env(safe-area-inset-right));bottom:max(16px,env(safe-area-inset-bottom));min-height:48px;min-width:76px;z-index:9999;border:1px solid #c0392b;background:#111;color:#fff;border-radius:999px;padding:.7rem 1rem;font:700 .72rem -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;letter-spacing:.12em;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.35)}.pixie-button:hover{background:#c0392b}
.pixie-backdrop{position:fixed;inset:0;margin:auto;width:min(720px,calc(100% - 2rem));max-height:calc(100dvh - 2rem);padding:0;border:0;border-radius:10px;background:#111;color:#eee}.pixie-backdrop::backdrop{background:rgba(0,0,0,.72)}
.pixie-panel{width:100%;max-height:calc(100dvh - 2rem);overflow:auto;background:#111;color:#eee;border:1px solid #303030;border-radius:10px;padding:1.25rem;box-shadow:0 20px 70px rgba(0,0,0,.55);font:16px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.pixie-panel-head{display:flex;justify-content:space-between;gap:1rem;align-items:center;margin-bottom:1rem}.pixie-panel-head h2{margin:0;font-size:1.1rem;color:#fff}.pixie-button:focus-visible,.pixie-close:focus-visible,.pixie-grid a:focus-visible{outline:3px solid #f2c16b;outline-offset:3px}.pixie-close{min-height:48px;min-width:64px;background:transparent;color:#aaa;border:1px solid #303030;border-radius:4px;padding:.4rem .65rem;cursor:pointer}.pixie-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px}.pixie-grid a{display:block;background:#171717;border:1px solid #303030;border-radius:6px;padding:.85rem;color:#fff;text-decoration:none}.pixie-grid a:hover{border-color:#c0392b}.pixie-grid strong{display:block;color:#fff;font-size:.88rem;margin-bottom:.2rem}.pixie-grid span{display:block;color:#aaa;font-size:.76rem;line-height:1.45}@media print{.pixie-button,.pixie-backdrop{display:none!important}}
.pixie-note{color:#aaa;font-size:.76rem;margin:.9rem 0 0}`;const st=document.createElement("style");st.textContent=css;document.head.appendChild(st);
const root=new URL("../",new URL(s.src,location.href));const link=p=>new URL(p,root).href;
const b=document.createElement("button");b.className="pixie-button";b.type="button";b.id="pixie-open";b.setAttribute("aria-controls","pixie-panel");b.setAttribute("aria-expanded","false");b.textContent="PIXIE";document.body.appendChild(b);
const d=document.createElement("dialog");d.className="pixie-backdrop";d.id="pixie-panel";d.setAttribute("role","dialog");d.setAttribute("aria-modal","true");d.setAttribute("aria-labelledby","pixie-title");d.innerHTML=`<div class="pixie-panel"><div class="pixie-panel-head"><h2 id="pixie-title">PIXIE · Project guide</h2><button class="pixie-close" type="button" id="pixie-close">Close</button></div><div class="pixie-grid">
<a href="${link("")}"><strong>Project home</strong><span>Return to Break the Grid.</span></a>
<a href="${link("VARIANT-RULES.html")}"><strong>Inpatient Corridors rules</strong><span>Open the paper-playtest scenario.</span></a>
<a href="${link("review/")}"><strong>Review the project</strong><span>Choose a route and write feedback.</span></a>
<a href="${link("interactive/yellow-door/docs/")}"><strong>Play Yellow Door</strong><span>Open the separate browser-story alpha.</span></a>
<a href="${link("event/")}"><strong>Event Phase</strong><span>View proposed event planning.</span></a>
<a href="https://www.superme.ai/ibloud_ivxx" target="_blank" rel="noreferrer"><strong>ibloud · SuperMe</strong><span>Creator profile and personal context.</span></a>
<a href="https://heartsupport.com/" target="_blank" rel="noreferrer"><strong>HeartSupport</strong><span>Public support resource.</span></a>
<a href="${link("next-phase/")}"><strong>Next Phase</strong><span>Review the release-architecture study.</span></a>
<a href="${link("RIGHTS-AND-SAFETY.html")}"><strong>Safety</strong><span>Rights, consent, and safety boundaries.</span></a>
<a href="${link("STATUS-AND-PROVENANCE.html")}"><strong>Provenance</strong><span>Current status and development record.</span></a>
<a href="https://github.com/ibloud/violets-revenge" target="_blank" rel="noreferrer"><strong>Violet's Revenge</strong><span>Companion project and coordination repo.</span></a>
<a href="https://github.com/ibloud/50-ways-to-leave-another/blob/main/docs/interactive-narrative-writer-path.md" target="_blank" rel="noreferrer"><strong>50 Ways Writer Path</strong><span>Interactive-narrative training pathway.</span></a>
</div><p class="pixie-note">Participant coordination is gated: complete/win the game first, then receive the Discord invitation. Discord is not the public entry point.</p></div>`;document.body.appendChild(d);
const close=document.getElementById("pixie-close");
let previousFocus;
b.addEventListener("click",()=>{if(d.open)return;previousFocus=document.activeElement;d.showModal();b.setAttribute("aria-expanded","true");close.focus()});
close.addEventListener("click",()=>d.close());
d.addEventListener("click",e=>{if(e.target===d){const rect=d.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)d.close()}});
d.addEventListener("close",()=>{b.setAttribute("aria-expanded","false");if(previousFocus?.isConnected)previousFocus.focus()});
})();
