'use strict';
(() => {
const form=document.querySelector('#lab-form'); if(!form)return;
const result=document.querySelector('#lab-result'), exp=document.querySelector('#lab-export');
const el=id=>document.getElementById(id), n=id=>Number(el(id).value), ck=id=>el(id).checked, file=id=>el(id).files[0];
const fmt=x=>Number(x.toFixed(2)).toLocaleString('en-US');
const duration=s=>`${fmt(s/60)} minutes (${fmt(s/3600)} hours)`;
async function hash(f){if(!f)throw Error('Select a file first.');if(f.size>64*1024*1024)throw Error('File exceeds the 64 MiB limit.');if(!crypto.subtle)throw Error('Open this tool over HTTPS or localhost.');return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',await f.arrayBuffer())),x=>x.toString(16).padStart(2,'0')).join('');}
async function run(t){switch(t){
case 'file-integrity':{const a=file('a'),b=file('b'),x=await hash(a),y=await hash(b);return `${x===y?'MATCH':'DIFFERENT'}\nOriginal: ${a.name} (${a.size} bytes)\n${x}\nCompared: ${b.name} (${b.size} bytes)\n${y}`;}
case 'sha256':{const a=file('a');return `${a.name} (${a.size} bytes)\nSHA-256: ${await hash(a)}`;}
case 'storage':return `Estimated minimum capacity: ${fmt((n('a')+n('b')*n('c')+n('d'))/(1-n('e')/100))} GB\nSelect a larger available capacity; model excludes overhead.`;
case '321-audit':{const checks=[[n('a')>=3,'At least three copies'],[n('b')>=2,'Two storage types'],[ck('c'),'One offsite copy'],[ck('d'),'Offline or immutable copy'],[ck('e'),'Recent restore test']];return checks.map(([ok,label])=>`${ok?'REPORTED YES':'GAP'} — ${label}`).join('\n');}
case 'recovery-time':return `Estimated total: ${duration(n('a')*1000/n('b')+n('c')*60)}\nTransfer alone: ${duration(n('a')*1000/n('b'))}`;
case 'cloud-upload':return `Estimated upload: ${duration(n('a')*8000/(n('b')*n('c')/100))}\nEffective upload: ${fmt(n('b')*n('c')/100)} Mbps`;
case 'duplicates':{const fs=Array.from(el('a').files);if(fs.length>100)throw Error('Select at most 100 files.');const m=new Map();for(const f of fs){const h=await hash(f);if(!m.has(h))m.set(h,[]);m.get(h).push(`${f.name} (${f.size} bytes)`);}const groups=[...m.entries()].filter(([h,g])=>g.length>1);return `${fs.length} files checked; ${groups.length} identical-content group(s).\n`+groups.map(([h,g],i)=>`\nGroup ${i+1}\n${g.join('\n')}\n${h}`).join('\n');}
case 'schedule':return `Local backup: every ${fmt(n('a'))} hours or more frequently.\nOffsite copy: every ${fmt(n('b'))} hours.\nRestore rehearsal: every ${fmt(n('c'))} days.\n${n('b')>n('a')?'Warning: offsite target exceeds stated acceptable loss.':'Offsite interval fits the stated target, if runs succeed.'}`;
case 'risk':return `Device failure: ${ck('a')||ck('c')?'reported separate copy available':'no reported separate copy'}\nLocal fire or theft: ${ck('c')?'cloud candidate; verify offsite access':'no reported offsite copy'}\nRansomware: ${ck('a')&&ck('b')||ck('c')&&ck('e')?'potential protected copy; test recovery':'no reported protected copy'}\nCloud account lockout: ${ck('a')?'local candidate available':'no reported local alternative'}\nShared account compromise: ${ck('c')&&ck('d')?'reported independent cloud access':'independence not confirmed'}\nAll outcomes conditional; no guarantee.`;
case 'health-report':{const today=new Date().toISOString().slice(0,10);if(el('a').value>today||el('b').value>today)throw Error('Use dates no later than today (UTC).');return `Backup evidence report\nLast successful backup: ${el('a').value}\nLast successful restore: ${el('b').value||'Not recorded'}\nAcceptable loss: ${n('c')} hours\nIndependent offsite copy: ${ck('d')?'Reported confirmed':'Not confirmed'}\nNext corrective action: ${el('e').value||'Not recorded'}\nVerify exact backup timestamps against your recovery target.`;}
 default:throw Error('Unknown tool');}}
let busy=false, last='';form.addEventListener('submit',async e=>{e.preventDefault();if(busy)return;busy=true;const btn=form.querySelector('button[type=submit]');btn.disabled=true;exp.disabled=true;result.textContent='Working…';try{last=await run(form.dataset.tool);result.textContent=last;exp.disabled=false;}catch(err){last='';result.textContent=err.message||'Check failed.';}finally{busy=false;btn.disabled=false;}});
form.addEventListener('input',()=>{if(!busy){last='';exp.disabled=true;result.textContent='Inputs changed. Run check again.';}});
exp.addEventListener('click',()=>{if(!last)return;const u=URL.createObjectURL(new Blob([last+'\n'],{type:'text/plain'}));const a=document.createElement('a');a.href=u;a.download=`backupharbor-${form.dataset.tool}.txt`;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);});
})();
