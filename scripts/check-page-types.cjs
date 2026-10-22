const fs=require('node:fs');
const assert=require('node:assert/strict');
const path=require('node:path');
const Module=require('node:module');
let bootstrap=fs.readFileSync(path.join(__dirname,'check-site.cjs'),'utf8');
bootstrap=bootstrap.slice(0,bootstrap.indexOf('const {allPages'))+'\nmodule.exports=load;';
const loaderModule=new Module(path.join(__dirname,'page-type-loader.cjs'),module);loaderModule.filename=path.join(__dirname,'page-type-loader.cjs');loaderModule.paths=module.paths;loaderModule._compile(bootstrap,loaderModule.filename);
const load=loaderModule.exports;
const {allPages}=load('app/route-map.ts');
const {pageTypes}=load('lib/page-types.ts');
const {normalizeDrafts,draftToText}=load('lib/workspace.ts');
const kinds=Object.keys(pageTypes);
assert.equal(kinds.length,41,'Exactly 41 page types must be documented');
for(const kind of kinds){
  const example=allPages.find(p=>p.kind===kind);assert.ok(example,`No route for ${kind}`);
  const file=path.join(__dirname,'../app',example.path==='/'?'':example.path.slice(1),'page.tsx');
  assert.ok(fs.existsSync(file),`Missing filesystem page for ${kind}`);
  assert.match(fs.readFileSync(file,'utf8'),/export default function Page\(/,`Missing page export for ${kind}`);
}
const draft={id:1,title:'Test sourcing brief',type:'request-form',fields:{product:'Rice',quantity:'20',unit:'Metric tons',destination:'Nigeria',message:'25 kg export bags'}};
assert.equal(normalizeDrafts([null,{id:2,title:'Bad',type:'contact',fields:null},draft]).length,1,'Malformed storage records must be ignored');
assert.equal(normalizeDrafts({}).length,0);
assert.ok(draftToText(draft).includes('Quantity: 20'));
assert.ok(draftToText(draft).includes('Unit: Metric tons'));
assert.ok(draftToText(draft).includes('not sent or published'));
const formFields={
  'request-form':['product','sector','category','quantity','unit','deliveryTerms','destination','email'],
  'freight-form':['product','originCountry','originPort','destination','destinationPort','equipment','ready','weight','email'],
  'cargo-form':['product','sector','quantity','unit','condition','packaging','destination','available','email'],
  'event-form':['product','eventType','sector','start','end','destination','city','venue','email'],
  contact:['subject','topic','name','email','message'],
};
async function main(){
  console.log('Passed: all 41 page components have routes; draft storage validation and export retain sourcing data.');
  const origin=process.env.SITE_CHECK_URL;if(!origin)return;
  const coverage=[];
  for(const kind of kinds){
    const example=allPages.find(p=>p.kind===kind);const response=await fetch(origin+example.path);assert.equal(response.status,200,kind);const html=await response.text();assert.ok(html.includes(`data-page-kind="${kind}"`),`Missing ${kind} screen marker`);
    for(const field of formFields[kind]||[])assert.ok(html.includes(`name="${field}"`),`${kind} needs ${field}`);
    if(kind!=='status')assert.ok(!html.includes('Internal Server Error'),kind);coverage.push({kind,title:pageTypes[kind].title,example:example.path,status:response.status});
  }
  const directory=await (await fetch(origin+'/site-map')).text();assert.equal((directory.match(/data-page-type="/g)||[]).length,41,'Directory must render all 41 review cards');
  fs.writeFileSync(path.join(__dirname,'../reference/page-type-validation.json'),JSON.stringify({checkedAt:new Date().toISOString(),totalPageTypes:kinds.length,totalRoutes:allPages.length,coverage},null,2));
  console.log('Passed: representative HTTP screen for each of 41 page types, specialized form fields, and 41 review cards.');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
