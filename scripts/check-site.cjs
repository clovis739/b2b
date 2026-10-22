const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const cache = new Map();
function load(file) {
  file = path.resolve(root, file);
  if (cache.has(file)) return cache.get(file).exports;
  const mod = { exports: {} }; cache.set(file, mod);
  const code = ts.transpileModule(fs.readFileSync(file,'utf8'), { compilerOptions: {module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022} }).outputText;
  const localRequire = name => {
    if (!name.startsWith('.')) return require(name);
    const base=path.resolve(path.dirname(file),name);
    const target=[base,`${base}.ts`,`${base}.tsx`].find(p=>fs.existsSync(p)&&fs.statSync(p).isFile());
    if (!target) throw new Error(`Missing module ${name}`);
    return load(target);
  };
  new Function('require','module','exports',code)(localRequire,mod,mod.exports);
  return mod.exports;
}
const {allPages,routeMap}=load('app/route-map.ts');
const {sourcePosts}=load('app/blog-source-data.ts');
const {siteProducts,sectors,productPath,articles,events,requests,cargo}=load('app/site-data.ts');
const {calculateLoad}=load('lib/logistics.ts');
assert.equal(sectors.length,33,'All 33 sector entries should be present');
assert.equal(new Set(allPages.map(p=>p.path)).size,allPages.length,'Routes must be unique');
for(const p of siteProducts){
  assert.ok(routeMap.has(productPath(p)),`Missing product ${p.slug}`);
  assert.ok(routeMap.has(`/b2bmarket/supplier-listing/${p.supplierSlug}`));
  assert.ok(routeMap.has(`/b2bmarket/listing/${p.sector}/${p.category}`),`Missing category ${p.category}`);
  assert.ok(fs.existsSync(path.join(root,'public/images',`${p.image}.jpg`)),`Missing image ${p.image}`);
}
for(const p of allPages){
  const file=path.join(root,'app',p.path==='/'?'':p.path.slice(1),'page.tsx');
  assert.ok(fs.existsSync(file),`Missing filesystem page ${p.path}`);
  const source=fs.readFileSync(file,'utf8');
  const ast=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
  let entry;
  function findEntry(node){
    if(ts.isVariableDeclaration(node)&&node.name.getText(ast)==='entry'&&node.initializer){
      assert.ok(ts.isObjectLiteralExpression(node.initializer),`Page entry must be a local object: ${p.path}`);
      entry=Object.fromEntries(node.initializer.properties.map(property=>{
        assert.ok(ts.isPropertyAssignment(property)&&ts.isStringLiteral(property.initializer),`Invalid page entry at ${p.path}`);
        return [property.name.text,property.initializer.text];
      }));
    }
    ts.forEachChild(node,findEntry);
  }
  findEntry(ast);
  assert.deepEqual(entry,p,`Page entry must match the navigation inventory: ${p.path}`);
  assert.match(source,/import \w+ from "@\/components\//,`Page must directly import a component: ${p.path}`);
  assert.ok(!source.includes('routeMap.get')&&!source.includes('SitePage'),`Page must not use a route lookup: ${p.path}`);
  if(p.kind==='product')assert.ok(siteProducts.some(x=>x.slug===p.key));
  if(p.kind==='article')assert.ok([...articles,...sourcePosts].some(x=>x.slug===p.key));
  if(p.kind==='event')assert.ok(events.some(x=>x.slug===p.key));
  if(p.kind==='rfq')assert.ok(requests.some(x=>x.id===p.key));
  if(p.kind==='cargo-detail')assert.ok(cargo.some(x=>x.id===p.key));
}
assert.ok(!fs.existsSync(path.join(root,'app/[...slug]/page.tsx')),'Catch-all routing must be removed');
const fit=calculateLoad(60,40,40,20,100,0);
assert.equal(fit.fit,100);assert.equal(fit.containers,1);assert.equal(fit.totalWeight,2000);assert.ok(Math.abs(fit.volume-9.6)<0.001);
const oversized=calculateLoad(900,900,900,20,10,0);assert.equal(oversized.fit,0);
const heavy=calculateLoad(60,40,40,20000,4,0);assert.equal(heavy.fit,1);assert.equal(heavy.containers,4);
const rotated=calculateLoad(250,100,100,20,10,0);assert.ok(rotated.fit>0,'Rotation should allow a 250cm edge along container length');
console.log(`Passed: ${allPages.length} routes, ${siteProducts.length} products, 33 sectors, linked detail data, local images, and packing/weight calculations.`);
async function checkHttp(){
  const origin=process.env.SITE_CHECK_URL;
  if(!origin)return;
  const missingLinks=new Set();
  const externalNavigation=new Set();
  for(let i=0;i<allPages.length;i+=8){
    await Promise.all(allPages.slice(i,i+8).map(async p=>{
      const response=await fetch(`${origin}${p.path}`);
      const expectedStatus = p.path === '/404' ? 404 : p.path === '/500' ? 500 : 200;
      assert.equal(response.status,expectedStatus,`HTTP status for ${p.path}`);
      const html=await response.text();
      if (process.env.SITE_BRAND_NAME) {
        const title = html.match(/<title>([^<]*)<\/title>/)?.[1] || '';
        assert.ok(title.includes(process.env.SITE_BRAND_NAME), `Missing brand in title at ${p.path}`);
      }
      assert.ok(html.includes('</main>'),`Missing main content at ${p.path}`);
      const contentMarker = p.kind === 'status' && p.key
        ? `data-status-code="${p.key}"`
        : `data-page-kind="${p.kind}"`;
      assert.ok(html.includes(contentMarker),`Missing page-type content at ${p.path}`);
      assert.ok(!html.includes('<title>Internal Server Error</title>'),`Server error at ${p.path}`);
      for (const match of html.matchAll(/<(?:a|form|iframe)\b[^>]*\b(?:href|action|src)="([^"]*)"/gi)) {
        const destination = match[1];
        if (/^(?:https?:)?\/\//i.test(destination)) {
          const target = new URL(destination, origin);
          if (target.origin !== new URL(origin).origin) externalNavigation.add(`${p.path} -> ${destination}`);
        }
      }
      for(const match of html.matchAll(/href="(\/[^"?#]*)[^\"]*"/g)){
        const href=match[1];if(!href.startsWith('/_next')&&!href.startsWith('//')&&!['/favicon.ico','/icon.svg','/sitemap.xml','/robots.txt'].includes(href)&&!routeMap.has(href))missingLinks.add(`${p.path} -> ${href}`);
      }
    }));
  }
  assert.deepEqual([...missingLinks],[],'Rendered internal links must resolve to registered routes');
  assert.deepEqual([...externalNavigation], [], 'Navigation, forms and embedded pages must stay on this site');
  assert.equal((await fetch(`${origin}/this-page-does-not-exist`)).status,404);
  assert.equal((await fetch(`${origin}/sitemap.xml`)).status,200);
  assert.equal((await fetch(`${origin}/robots.txt`)).status,200);
  console.log(`Passed: HTTP rendering, local-only navigation and internal links on all ${allPages.length} pages, sitemap, robots, and unknown-route 404.`);
}
checkHttp().catch(error=>{console.error(error);process.exitCode=1;});
