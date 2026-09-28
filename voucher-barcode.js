// eXtra Trade-In voucher numbering and UPC-A barcode
(function(){
  let lastVoucherNumber='';
  function checkDigit11(s){let sum=0;for(let i=0;i<11;i++)sum+=Number(s[i])*(i%2===0?3:1);return String((10-(sum%10))%10)}
  function newVoucherNumber(){let base=String(Date.now()).slice(-11);let n=base+checkDigit11(base);if(n===lastVoucherNumber){base=String((BigInt(base)+1n)%100000000000n).padStart(11,'0');n=base+checkDigit11(base)}lastVoucherNumber=n;return n}
  const L={0:'0001101',1:'0011001',2:'0010011',3:'0111101',4:'0100011',5:'0110001',6:'0101111',7:'0111011',8:'0110111',9:'0001011'};
  const R={0:'1110010',1:'1100110',2:'1101100',3:'1000010',4:'1011100',5:'1001110',6:'1010000',7:'1000100',8:'1001000',9:'1110100'};
  function upcBits(n){return '101'+n.slice(0,6).split('').map(d=>L[d]).join('')+'01010'+n.slice(6).split('').map(d=>R[d]).join('')+'101'}
  function svg(n){let bits=upcBits(n),module=2,quiet=18,h=72,w=bits.length*module+quiet*2;let bars='';for(let i=0;i<bits.length;i++)if(bits[i]==='1')bars+=`<rect x="${quiet+i*module}" y="2" width="${module}" height="${h}"/>`;return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="100" viewBox="0 0 ${w} 100" role="img" aria-label="UPC ${n}"><rect width="100%" height="100%" fill="white"/>${bars}<text x="${w/2}" y="94" text-anchor="middle" font-family="Arial" font-size="15" letter-spacing="2">${n}</text></svg>`}
  function ensureBox(){let head=document.querySelector('#voucher .vhead');if(!head)return null;let box=document.getElementById('voucherIdentity');if(!box){box=document.createElement('div');box.id='voucherIdentity';box.style.cssText='margin:14px auto 4px;padding:12px;border:1px solid #d1d5db;border-radius:8px;max-width:420px;background:#fff';box.innerHTML='<div style="font-size:12px;font-weight:700">VOUCHER NO. / رقم القسيمة</div><div id="voucherNo" style="font-size:22px;font-weight:800;margin:5px 0"></div><div id="voucherBarcode" style="display:flex;justify-content:center;overflow:hidden"></div>';head.appendChild(box)}return box}
  function applyVoucherIdentity(){let box=ensureBox();if(!box)return;let n=newVoucherNumber();document.getElementById('voucherNo').textContent=n;document.getElementById('voucherBarcode').innerHTML=svg(n)}
  const originalIssue=window.issue;
  window.issue=function(){let before=document.getElementById('voucher')?.style.display;originalIssue.apply(this,arguments);let v=document.getElementById('voucher');if(v&&v.style.display==='block'&&before!=='block')applyVoucherIdentity();else if(v&&v.style.display==='block')applyVoucherIdentity()};
})();