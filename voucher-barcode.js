// eXtra Trade-In voucher numbering, Code 128 barcode and print layout
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

  // Keep the printed voucher on one A4 portrait page, matching the on-screen voucher design.
  const printStyle=document.createElement('style');
  printStyle.textContent=`
    @page{size:A4 portrait;margin:7mm}
    @media print{
      html,body{width:210mm!important;height:297mm!important;margin:0!important;padding:0!important;background:#fff!important;overflow:hidden!important}
      body *{visibility:hidden!important}
      #voucher,#voucher *{visibility:visible!important}
      #voucher{display:block!important;position:absolute!important;left:0!important;top:0!important;width:196mm!important;height:auto!important;max-height:283mm!important;margin:0!important;padding:6mm!important;border:1px solid #111827!important;box-shadow:none!important;overflow:hidden!important;font-size:10.5pt!important;line-height:1.22!important}
      #voucher .vhead{padding-bottom:3mm!important;margin-bottom:3mm!important;border-bottom:2px solid #ffd400!important}
      #voucher .vhead .brand{font-size:18pt!important;margin:0!important}
      #voucher .vhead h1{font-size:19pt!important;margin:4mm 0 2.5mm!important}
      #voucherDate{font-size:10pt!important}
      #voucherIdentity{margin:3mm auto 1mm!important;padding:2.5mm!important;max-width:100mm!important;border-radius:5px!important}
      #voucherNo{font-size:15pt!important;margin:1mm 0!important;white-space:nowrap!important}
      #voucherBarcode{height:24mm!important;overflow:hidden!important}
      #voucherBarcode svg{height:24mm!important;max-width:92mm!important;width:auto!important}
      #voucher .vgrid{display:grid!important;grid-template-columns:1fr 1fr!important;column-gap:12mm!important;row-gap:1.6mm!important;font-size:9.5pt!important;margin-top:3mm!important}
      #voucher .vgrid>div{break-inside:avoid!important;page-break-inside:avoid!important}
      #voucher .ack{margin:4mm 0 0!important;padding:3mm!important;font-size:9pt!important;line-height:1.35!important}
      #voucher .sign{margin-top:8mm!important;gap:18mm!important;font-size:9pt!important}
      #voucher .line{margin-top:8mm!important;padding-top:1.5mm!important}
      #voucher .no-print{display:none!important}
    }`;
  document.head.appendChild(printStyle);

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