// eXtra Trade-In voucher numbering and Code 128 barcode
(function(){
  let lastVoucherNumber='';
  function checkDigit11(s){let sum=0;for(let i=0;i<11;i++)sum+=Number(s[i])*(i%2===0?3:1);return String((10-(sum%10))%10)}
  function secureRandom(max){if(window.crypto&&crypto.getRandomValues){let a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]%max}return Math.floor(Math.random()*max)}
  function newVoucherNumber(){let timePart=String(Date.now()).slice(-7),randomPart=String(secureRandom(10000)).padStart(4,'0');let base=timePart+randomPart,n=base+checkDigit11(base);while(n===lastVoucherNumber){randomPart=String(secureRandom(10000)).padStart(4,'0');base=timePart+randomPart;n=base+checkDigit11(base)}lastVoucherNumber=n;return n}
  function mobileLast4(){let m=(document.getElementById('mobile')?.value||'').replace(/\D/g,'');return m.length>=4?m.slice(-4):m.padStart(4,'0')}
  const C128=['212222','222122','222221','121223','121322','131222','122213','122312','132212','221213','221312','231212','112232','122132','122231','113222','123122','123221','223211','221132','221231','213212','223112','312131','311222','321122','321221','312212','322112','322211','212123','212321','232121','111323','131123','131321','112313','132113','132311','211313','231113','231311','112133','112331','132131','113123','113321','133121','313121','211331','231131','213113','213311','213131','311123','311321','331121','312113','312311','332111','314111','221411','431111','111224','111422','121124','121421','141122','141221','112214','112412','122114','122411','142112','142211','241211','221114','413111','241112','134111','111242','121142','121241','114212','124112','124211','411212','421112','421211','212141','214121','412121','111143','111341','131141','114113','114311','411113','411311','113141','114131','311141','411131','211412','211214','211232','2331112'];
  function code128Svg(text){let vals=[104];for(let ch of text){let code=ch.charCodeAt(0);if(code<32||code>126)continue;vals.push(code-32)}let sum=104;for(let i=1;i<vals.length;i++)sum+=vals[i]*i;vals.push(sum%103,106);let modules=[];vals.forEach(v=>{let p=C128[v];for(let i=0;i<p.length;i++)modules.push([i%2===0,Number(p[i])])});let quiet=20,module=1.35,h=72,x=quiet,bars='';modules.forEach(([black,w])=>{if(black)bars+=`<rect x="${x}" y="2" width="${w*module}" height="${h}"/>`;x+=w*module});let width=x+quiet;return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="100" viewBox="0 0 ${width} 100" role="img" aria-label="Code 128 ${text}"><rect width="100%" height="100%" fill="white"/>${bars}<text x="${width/2}" y="94" text-anchor="middle" font-family="Arial" font-size="13" letter-spacing="1">${text}</text></svg>`}
  function ensureBox(){let head=document.querySelector('#voucher .vhead');if(!head)return null;let box=document.getElementById('voucherIdentity');if(!box){box=document.createElement('div');box.id='voucherIdentity';box.style.cssText='margin:14px auto 4px;padding:12px;border:1px solid #d1d5db;border-radius:8px;max-width:520px;background:#fff';box.innerHTML='<div style="font-size:12px;font-weight:700">VOUCHER NO. / رقم القسيمة</div><div id="voucherNo" style="font-size:22px;font-weight:800;margin:5px 0"></div><div id="voucherBarcode" style="display:flex;justify-content:center;overflow:hidden"></div>';head.appendChild(box)}return box}
  function applyVoucherIdentity(){let box=ensureBox();if(!box)return;let n=newVoucherNumber(),ref='EXTRA-'+n+'-'+mobileLast4();document.getElementById('voucherNo').textContent=ref;document.getElementById('voucherBarcode').innerHTML=code128Svg(ref)}
  const originalIssue=window.issue;
  window.issue=function(){
    const approval=document.getElementById('approval');
    if(approval&&approval.value==='yes'){
      const ok=confirm('Are you sure you want to approve this Trade-In?\nThe voucher will be issued and this action cannot be reversed.\n\nهل أنت متأكد من الموافقة على عملية الاستبدال؟\nسيتم إصدار القسيمة ولا يمكن الرجوع عن هذا الإجراء.');
      if(!ok)return;
    }
    originalIssue.apply(this,arguments);
    let v=document.getElementById('voucher');if(v&&v.style.display==='block')applyVoucherIdentity();
  };
})();