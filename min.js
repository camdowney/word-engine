const t=(t,e)=>{t.dispatchEvent(new Event(e))},e=(t,e)=>{const n="string"==typeof t?document.querySelectorAll(t):t;"function"==typeof n[Symbol.iterator]?[...n].forEach(e):e(n)},n=(t,n,r)=>{const o=new CustomEvent(n,{detail:r});e(t,(t=>t.dispatchEvent(o)))},r=n=>{e(n,(n=>{t(n,"unmount"),e(n.children,(e=>t(e,"unmount"))),n.remove()}))},o=({tag:t,...e})=>{let n={},r={},o={};Object.entries(e).forEach((([t,e])=>t.startsWith("__")?n[t.substring(2)]=e:t.startsWith("_")?r[t.substring(1)]=e:o[t]=e));const c=document.createElement(t||"div");Object.entries(o).forEach((([t,e])=>c.setAttribute(t.replaceAll("_","-"),e)));const i=t=>c.addEventListener(...t);return Object.entries(n).forEach((t=>{i(["mount",()=>window.addEventListener(...t)]),i(["unmount",()=>window.removeEventListener(...t)])})),Object.entries(r).forEach(i),c};let c=[],i=0;const s=(e,n,r)=>{if(!e||void 0===n)return;if("function"==typeof n)return s(e,{tag:n});if(Array.isArray(n))return n.forEach((t=>s(e,t)));const a="string"==typeof e?document?.querySelector(e):e;if("object"!=typeof n)return a.innerHTML+=n;const u="function"==typeof n?.tag,l=i,f=u?n?.tag({get:()=>c[l],...n}):n,{c:d,...h}="object"!=typeof f||Array.isArray(f)?{tag:"span",c:f}:f;let p=null;!r||r>=a.children.length?(a.append(o(h)),p=a.lastChild):(a.insertBefore(o(h),a.children[r]),p=a.children[r]),u&&(c[i++]=p),s(p,d),t(p,"mount")};export{s as render,n as signal,r as unmount};