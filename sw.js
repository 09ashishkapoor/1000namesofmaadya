
if(!self.define){let e,s={};const n=(n,i)=>(n=new URL(n+".js",i).href,s[n]||new Promise(s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()}).then(()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e}));self.define=(i,c)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let a={};const o=e=>n(e,t),r={module:{uri:t},exports:a,require:o};s[t]=Promise.all(i.map(e=>r[e]||o(e))).then(e=>(c(...e),a))}}define(["./workbox-239d0d27"],function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([
  {url:"index.html",revision:null},
  {url:"styles.css",revision:null},
  {url:"navigation.css",revision:null},
  {url:"navigation.js",revision:null},
  {url:"app.js",revision:null},
  {url:"registerSW.js",revision:null},
  {url:"MaaAdyaKali_5.png",revision:null},
  {url:"manifest.webmanifest",revision:null},
  {url:"workbox-239d0d27.js",revision:null}
],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"))),e.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-cache",plugins:[new e.ExpirationPlugin({maxEntries:10,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.gstatic\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-cache",plugins:[new e.ExpirationPlugin({maxEntries:10,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/\/sahasranama_meanings\.json$/,new e.NetworkFirst({cacheName:"sahasranama-data",plugins:[new e.ExpirationPlugin({maxEntries:1,maxAgeSeconds:604800})]}),"GET")});
