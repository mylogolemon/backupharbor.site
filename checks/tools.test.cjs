const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');const {webcrypto}=require('node:crypto');const path=require('node:path');
const source=file=>fs.readFileSync(path.join(__dirname,'..','assets',file),'utf8');
function element(values={}){return {value:'',checked:false,disabled:false,files:[],textContent:'',listeners:{},children:[],...values,addEventListener(type,fn){this.listeners[type]=fn},append(...x){this.children.push(...x)},replaceChildren(...x){this.children=x},click(){this.clicked=true},remove(){},style:{}}}
function labHarness(tool,fields){const result=element(),exportButton=element({disabled:true}),button=element();const gate=element({disabled:true});const form=element({dataset:{tool},querySelector:s=>s==='#js-lab-controls'?gate:null,querySelectorAll:()=>[...Object.values(fields),button]});const doc={querySelector(s){return {'#lab-form':form,'#lab-result':result,'#lab-export':exportButton}[s]},getElementById(id){return fields[id]},createElement(){return element()},body:element()};const context={document:doc,crypto:webcrypto,Date,Number,Math,Map,Array,Uint8Array,Blob,URL:{createObjectURL:()=>'',revokeObjectURL(){}},setTimeout(){}};vm.runInNewContext(source('lab.js'),context);return {form,result,exportButton,button};}
const val=x=>element({value:String(x)});const check=x=>element({checked:x});
async function submit(form){await form.listeners.submit({preventDefault(){}})}
function fileFrom(contents,name){const b=Buffer.from(contents);return {name,size:b.length,async arrayBuffer(){return Uint8Array.from(b).buffer}}}
test('storage, recovery and upload examples use the advertised decimal units',async()=>{
 let h=labHarness('storage',{a:val(500),b:val(10),c:val(12),d:val(100),e:val(20)});await submit(h.form);assert.match(h.result.textContent,/900 GB/);
 h=labHarness('recovery-time',{a:val(100),b:val(50),c:val(30)});await submit(h.form);assert.match(h.result.textContent,/63\.33 minutes/);
 h=labHarness('cloud-upload',{a:val(100),b:val(20),c:val(80)});await submit(h.form);assert.match(h.result.textContent,/833\.33 minutes/);assert.match(h.result.textContent,/16 Mbps/);
});
test('audit rejects more storage types than copies and risk rejects contradictory answers',async()=>{
 let h=labHarness('321-audit',{a:val(1),b:val(2),c:check(false),d:check(false),e:check(false)});await submit(h.form);assert.match(h.result.textContent,/cannot exceed/);assert.equal(h.exportButton.disabled,true);
 h=labHarness('risk',{a:check(false),b:check(true),c:check(false),d:check(false),e:check(false)});await submit(h.form);assert.match(h.result.textContent,/Select the local external drive/);
 h=labHarness('risk',{a:check(false),b:check(false),c:check(false),d:check(true),e:check(false)});await submit(h.form);assert.match(h.result.textContent,/Select a cloud copy/);
});
test('hash comparison uses selected bytes and invalidates export after a change',async()=>{
 const a=element({files:[fileFrom('safe sample','original.txt')]}),b=element({files:[fileFrom('safe sample','copy.txt')]});let h=labHarness('file-integrity',{a,b});await submit(h.form);assert.match(h.result.textContent,/^MATCH/);assert.equal(h.exportButton.disabled,false);h.form.listeners.input();assert.equal(h.exportButton.disabled,true);assert.match(h.result.textContent,/Inputs changed/);
 b.files=[fileFrom('altered','changed.txt')];await submit(h.form);assert.match(h.result.textContent,/^DIFFERENT/);
});
test('controls are disabled during an asynchronous hash, then restored',async()=>{
 let release;const deferred=new Promise(resolve=>release=resolve);const a=element({files:[{name:'slow.txt',size:1,arrayBuffer:()=>deferred}]});const h=labHarness('sha256',{a});const pending=submit(h.form);assert.equal(a.disabled,true);assert.equal(h.button.disabled,true);release(Uint8Array.from([65]).buffer);await pending;assert.equal(a.disabled,false);assert.equal(h.button.disabled,false);assert.match(h.result.textContent,/SHA-256/);
});
test('backup plan disables stale export when inputs change',()=>{
 const ids={'#plan-title':element(),'#plan-summary':element(),'#plan-steps':element(),'#copy-plan':element({disabled:true}),'#download-plan':element({disabled:true}),'#last-test':element({value:'recent'})};const gate=element({disabled:true});const form=element({querySelector:s=>s==='#js-plan-controls'?gate:null});ids['#backup-form']=form;
 const doc={querySelector(s){return ids[s]},createElement(){return element()},body:element()};class FD{get(k){return {device:'laptop','change-rate':'daily'}[k]}getAll(k){return k==='data'?['photos']:[]}}
 vm.runInNewContext(source('plan.js'),{document:doc,FormData:FD,Blob,URL:{createObjectURL:()=>'',revokeObjectURL(){}},setTimeout(){},navigator:{clipboard:{writeText:async()=>{}}}});
 form.listeners.submit({preventDefault(){}});assert.equal(ids['#copy-plan'].disabled,false);assert.equal(ids['#download-plan'].disabled,false);form.listeners.change();assert.equal(ids['#copy-plan'].disabled,true);assert.equal(ids['#download-plan'].disabled,true);assert.match(ids['#plan-title'].textContent,/changed/);
});
test('restore drill indicates when saved notes have changed',()=>{
 const inputs=[element({parentElement:{textContent:'Step 1'}}),element({parentElement:{textContent:'Step 2'}})];const area=element({querySelectorAll:()=>inputs}),ids={'#drill-checklist':area,'#drill-count':element(),'#drill-percent':element(),'#drill-bar':element(),'#test-date':element(),'#test-source':element(),'#test-notes':element(),'#save-status':element(),'#save-drill':element(),'#reset-drill':element(),'#export-drill':element()};const memory=new Map(),storage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v),removeItem:k=>memory.delete(k)};
 vm.runInNewContext(source('drill.js'),{document:{querySelector:s=>ids[s]},localStorage:storage,JSON,Boolean,Math,Blob,URL:{createObjectURL:()=>'',revokeObjectURL(){}},setTimeout(){}});
 ids['#save-drill'].listeners.click();assert.match(ids['#save-status'].textContent,/Saved in this browser/);ids['#test-notes'].listeners.input();assert.match(ids['#save-status'].textContent,/Changes not saved/);
});
test('Recovery Lab samples have the advertised matching and altered digests',async()=>{
 const samples=path.join(__dirname,'..','lab','samples');const a=element({files:['original.txt','identical.txt','altered.txt'].map(name=>fileFrom(fs.readFileSync(path.join(samples,name)),name))});const h=labHarness('duplicates',{a});await submit(h.form);assert.match(h.result.textContent,/3 files checked; 1 matching-digest group/);assert.match(h.result.textContent,/original\.txt/);assert.match(h.result.textContent,/identical\.txt/);assert.doesNotMatch(h.result.textContent,/altered\.txt/);
});
