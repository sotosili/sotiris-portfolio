// Generates a BOOKMARKLET that auto-fills a job form inside YOUR OWN Chrome.
// Why: Ashby (and others) flag the Playwright automation browser as spam and block the submit.
// A bookmarklet runs in your real browser (navigator.webdriver = false) — like a password-manager
// autofill — so there's no bot flag. It fills the text fields; you still attach the CV, pick Location,
// and click Submit yourself.  Run:  node apply/make-bookmarklet.mjs
import fs from 'node:fs';
const profile = JSON.parse(fs.readFileSync('apply/profile.json', 'utf8'));
const F = profile.fields;
const data = {
  F: { name: F.name, firstName: F.firstName, lastName: F.lastName, email: F.email, phone: F.phone, location: F.location, portfolio: F.portfolio, linkedin: F.linkedin, github: F.github },
  WHERE: profile.whereHeard || '',
  ANS: profile.answers.map(a => ({ m: a.match, t: a.text })),
};

const body = `(function(){
var D=__DATA__;
function has(s){for(var i=1;i<arguments.length;i++){if(s.indexOf(arguments[i])>=0)return true;}return false;}
function decide(label){
 var s=label.toLowerCase(),F=D.F;
 if(has(s,'e-mail','email'))return F.email;
 if(has(s,'linkedin'))return F.linkedin;
 if(has(s,'github'))return F.github;
 if(has(s,'portfolio','website','personal site'))return F.portfolio;
 if(has(s,'phone','mobile','contact number'))return F.phone;
 if(has(s,'first name'))return F.firstName;
 if(has(s,'last name','surname'))return F.lastName;
 if(has(s,'full name')||s==='name'||has(s,'your name'))return F.name;
 if(has(s,'location','where are you based','city','country','based'))return F.location;
 if(has(s,'where did you hear','how did you hear','hear about'))return D.WHERE;
 if(has(s,"name you'd prefer",'name you prefer','preferred name'))return F.firstName;
 if(has(s,'ux process','design process','where can we learn','see your work','examples of your work'))return F.portfolio;
 var best=null,bs=0;
 for(var i=0;i<D.ANS.length;i++){var a=D.ANS[i],sc=0;for(var j=0;j<a.m.length;j++){if(s.indexOf(a.m[j].toLowerCase())>=0)sc++;}if(sc>bs){bs=sc;best=a;}}
 return best&&bs>0?best.t:null;
}
function setVal(el,val){var p=el.tagName==='TEXTAREA'?window.HTMLTextAreaElement.prototype:window.HTMLInputElement.prototype;var d=Object.getOwnPropertyDescriptor(p,'value');d.set.call(el,val);el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));}
var sel='textarea,input:not([type=hidden]):not([type=file]):not([type=checkbox]):not([type=radio]):not([type=submit]):not([type=button]):not([type=search])';
var n=0;
document.querySelectorAll(sel).forEach(function(el){
 var r=el.getBoundingClientRect();if(!(r.width>0&&r.height>0))return;
 if(el.value&&el.value.trim())return;
 var label=(el.getAttribute('aria-label')||'').trim();
 if(!label){var c=el.parentElement;for(var u=0;u<5&&c;u++){var l=c.querySelector('label,legend,h1,h2,h3,h4');if(l&&l.textContent.trim()){label=l.textContent.trim();break;}c=c.parentElement;}}
 if(!label)return;
 var v=decide(label);
 if(v&&String(v).slice(0,4)!=='TODO'){setVal(el,String(v));el.style.outline='2px solid #E8622C';n++;}
});
alert('\\u2713 Filled '+n+' fields.\\nNow: attach your CV, pick Location from its dropdown, then click Submit.');
})();`.replace('__DATA__', JSON.stringify(data));

const bookmarklet = 'javascript:' + encodeURIComponent(body);
fs.writeFileSync('apply/bookmarklet.txt', bookmarklet);
fs.writeFileSync('apply/bookmarklet.dev.js', body);
console.log(`Bookmarklet written → apply/bookmarklet.txt (${bookmarklet.length} chars)`);
console.log('Readable source → apply/bookmarklet.dev.js');
console.log('\nSETUP (once):');
console.log('1. Open apply/bookmarklet.txt, select ALL, copy.');
console.log('2. In Chrome: Bookmarks → show bookmarks bar → right-click it → Add page.');
console.log('3. Name it "Fill Application", paste the copied text as the URL, save.');
console.log('\nUSE: open a job form → click Apply → click the "Fill Application" bookmark → add CV + Location → Submit.');
