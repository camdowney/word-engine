let t=[],e=0;const n=(t,e)=>{t.dispatchEvent(new Event(e))},r=(o,c,i)=>{if(!o||void 0===c)return;const s="string"==typeof o?document?.querySelector(o):o;if(i&&(s.querySelectorAll("*").forEach((t=>n(t,"unmount"))),s.innerHTML=""),"function"==typeof c)return r(s,{tag:c});if(Array.isArray(c))return c.forEach((t=>r(s,t)));if("object"!=typeof c)return s.innerHTML+=c;const a="function"==typeof c?.tag,u=e,f=a?c?.tag({get:()=>t[u],...c}):c,{c:d,...l}="object"!=typeof f||Array.isArray(f)?{tag:"span",c:f}:f;s.append((({tag:t,...e})=>{let n={},r={},o={};Object.entries(e).forEach((([t,e])=>t.startsWith("__")?n[t.substring(2)]=e:t.startsWith("_")?r[t.substring(1)]=e:o[t]=e));const c=document.createElement(t||"div");Object.entries(o).forEach((([t,e])=>c.setAttribute(t.replaceAll("_","-"),e)));const i=t=>c.addEventListener(...t);return Object.entries(n).forEach((t=>{i(["mount",()=>window.addEventListener(...t)]),i(["unmount",()=>window.removeEventListener(...t)])})),Object.entries(r).forEach(i),c})(l));const E=s.lastChild;a&&(t[e++]=E),r(E,d),n(E,"mount")};export{r as default};
