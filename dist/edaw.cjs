"use strict";var O=Object.defineProperty;var W=(o,e,r)=>e in o?O(o,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):o[e]=r;var i=(o,e,r)=>(W(o,typeof e!="symbol"?e+"":e,r),r);Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const p={RoundedBorder:o=>`border-left: 2px solid ${o}; border-right: 2px solid ${o}; padding: 0 4px; border-radius: 5px; `},b={green:"color: #0d0; ",blue:"color: #0af; ",red:"color: #f20; ",orange:"color: #F80; ",purple:"color: #d602ee; "},U=typeof WorkerGlobalScope<"u"&&self instanceof WorkerGlobalScope,f=U?"W":"C",m={sendMsg:[`%c${f}⮞`,b.orange+p.RoundedBorder("#F80")],reciveMsg:[`%c${f}⮜`,b.green+p.RoundedBorder("#0d0")],Error:[`%c${f}⭙`,b.red+p.RoundedBorder("#f20")],ObserverRegister:[`%c${f}⭘`,b.purple+p.RoundedBorder("#d602ee")],ObserverUnRegister:[`%c${f}⮾`,b.purple+p.RoundedBorder("#d602ee")]},u="padding-left: 5px; padding-right: 5px; padding-top: 2px;",y="background-color: #38f; border-radius: 100px; color: #000;",R="background-color: #492; border-radius: 100px; color: #000;",D="background-color: #fa0; border-radius: 100px; color: #000;",k="background-color: #f53; border-radius: 100px; color: #000;";class C{static info(e,r=""){return e instanceof Array?["%c"+e.join(" | "),`${u} ${y}`,r]:["%c"+e,`${u} ${y}`,r]}static warn(e,r=""){return e instanceof Array?["%c"+e.join(" | "),`${u} ${k}`,r]:["%c"+e,`${u} ${k}`,r]}static yellow(e,r=""){return e instanceof Array?["%c"+e.join(" | "),`${u} ${D}`,r]:["%c"+e,`${u} ${D}`,r]}static succes(e,r=""){return e instanceof Array?["%c"+e.join(" | "),`${u} ${R}`,r]:["%c"+e,`${u} ${R}`,r]}}let w;const j=new Uint8Array(16);function S(){if(!w&&(w=typeof crypto<"u"&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!w))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return w(j)}const s=[];for(let o=0;o<256;++o)s.push((o+256).toString(16).slice(1));function B(o,e=0){return s[o[e+0]]+s[o[e+1]]+s[o[e+2]]+s[o[e+3]]+"-"+s[o[e+4]]+s[o[e+5]]+"-"+s[o[e+6]]+s[o[e+7]]+"-"+s[o[e+8]]+s[o[e+9]]+"-"+s[o[e+10]]+s[o[e+11]]+s[o[e+12]]+s[o[e+13]]+s[o[e+14]]+s[o[e+15]]}const A=typeof crypto<"u"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto),$={randomUUID:A};function N(o,e,r){if($.randomUUID&&!e&&!o)return $.randomUUID();o=o||{};const t=o.random||(o.rng||S)();if(t[6]=t[6]&15|64,t[8]=t[8]&63|128,e){r=r||0;for(let n=0;n<16;++n)e[r+n]=t[n];return e}return B(t)}class a{constructor(e,r,t){i(this,"id",N());i(this,"returnData");i(this,"error",!1);i(this,"resolved",!1);this.context=e,this.method=r,this.params=t}static parseMessageEvent(e){const{id:r,context:t,method:n,params:d,...l}=e.data;if(t&&n){const c=new a(t,n,d);return c.id=r,c.resolved=l.resolved??!1,c.returnData=l.returnData??void 0,l.error&&(c.error=l.error),c}else{const c=new a("","");return c.error=!0,c.returnData=e.data,c}}static parseErrorEvent(e){const r=new a("","");return r.error=!0,r.returnData=e,r}}class h{}i(h,"production",!1),i(h,"verbose",{worker:{showIn:!1,showOut:!0},browser:{showIn:!1,showOut:!0}});const g=typeof WorkerGlobalScope<"u"&&self instanceof WorkerGlobalScope;class F{constructor(e){i(this,"isWorker",typeof WorkerGlobalScope<"u"&&self instanceof WorkerGlobalScope);i(this,"handlers",[]);this.manager=e,e.addEventListener("message",r=>this.onWorkerMessage(r)),e.addEventListener("error",r=>this.onWorkerError(r)),e.addEventListener("messageerror",r=>this.onWorkerMessage(r))}onWorkerMessage(e){const r=a.parseMessageEvent(e);(g&&h.verbose.worker.showIn||!g&&h.verbose.browser.showIn)&&console.debug(...m.reciveMsg,{id:{id:r.id},context:r.context,method:r.method,returnData:r.returnData}),this.publish(r)}onWorkerError(e){const r=a.parseErrorEvent(e);console.error(...m.Error,{ev:e}),this.publish(r)}postMessage(e,r=!1){r&&(e.resolved=!0),(g&&h.verbose.worker.showOut||!g&&h.verbose.browser.showOut)&&console.debug(...m.sendMsg,{id:{id:e.id},context:e.context,method:e.method,returnData:e.returnData}),this.manager.postMessage(e)}publish(e){if(e.resolved)return this.dispatchEvent(e);const r=Object.values(this.routes).filter(t=>t.contextName===e.context);r.length!==0?r.forEach(async t=>{try{e.returnData=(await t.runEvent(this,e)).returnData}catch(n){e.error=!0,e.returnData=n}this.postMessage(e,!0)}):(e.error=!0,e.returnData=new Error("Route not found"),this.postMessage(e,!0))}dispatchEvent(e){const r=this.handlers.filter(t=>t.msgEvent.context===e.context&&t.msgEvent.method===e.method);for(const t of r)t.clbk(e)}offMessage(e){this.handlers=this.handlers.filter(r=>r.msgEvent.id!==e.id),console.debug(...m.ObserverUnRegister,e.id)}onMessage(e,r){const t=e;return this.handlers.push({msgEvent:t,clbk:r}),console.debug(...m.ObserverRegister,t.id,{context:e.context,method:e.method}),t}observe(e,r){const t=new a(e.context,e.method,e.params);return this.onMessage(t,r)}postReturn(e,r,t){const n=new a(e,r,t),d=new Promise((l,c)=>{this.onMessage(n,x=>{n.id===x.id&&(x.error?c(x.returnData):l(x),this.offMessage(n))})});return this.postMessage(n),d}async postInitialize(){console.groupCollapsed(`${g?"Worker":"Client"} route registers`),Object.entries(this.routes).forEach(([r,t])=>{Object.entries(t.EventRoutes).forEach(([n,d])=>{console.debug(...C.info("routeRegister",{context:t.contextName,method:n}))})}),console.groupEnd();const e=new a("root","initialized");e.returnData=this.getClientRoutes(),e.resolved=!0,this.postMessage(e,!0)}getClientRoutes(){return Object.entries(this.routes).reduce((e,[r,t])=>(e[r]=t.getRoutes(),e),{})}}class E{constructor(e,r){this.repo=e,this.run=r}async runMethod(e,r){if(typeof this.repo=="number"&&isNaN(this.repo))throw new Error("Repository is not initialized");return await this.run({repo:this.repo,params:e.params,bus:r,evMsg:e})}static prepareEvent(e){return r=>new E(r??NaN,e)}}class G{async runEvent(e,r){const t=Object.entries(this.EventRoutes).find(([d])=>d===r.method);if(!t)throw new Error("Method not found");const n=t[1];return r.returnData=await n.run({repo:this.repos,evMsg:r,params:r.params,bus:e}),r}getRoutes(){return Object.entries(this.EventRoutes).reduce((e,[r,t])=>(e[r]={context:this.contextName,method:r},e),{})}}class I{constructor(e,r){i(this,"filters",{});i(this,"sorter",null);this.route=e,this.client=r}setFilter(e,r){this.filters[e]=r}removeFilter(e){this.filters=Object.fromEntries(Object.entries(this.filters).filter(r=>r[0]!==e))}sort(e){this.sorter=e}getFilters(){return this.filters}getSort(){return this.sorter}}class v{constructor(e){this.builder=e}observe(e){const r=this.builder.client.observe({context:this.builder.route.context,method:this.builder.route.method,params:this.builder.route.params},e);return{postEvent:t=>this.postObserveMessage(r,t),removeObserver:()=>this.builder.client.offMessage(r)}}async postObserveMessage(e,r){e.params=r,this.builder.client.postMessage(e)}async run(e){return(await this.builder.client.postReturn(this.builder.route.context,this.builder.route.method,e)).returnData}static instanceBasic(e,r){const t=new I(r,e);return new v(t)}}class M{constructor(){i(this,"reactIDs",[])}onUpdate(e,r){const t=this.reactIDs.findIndex(n=>n.id==e);if(t==-1){this.reactIDs.push({id:e,callback:r});return}this.reactIDs[t].callback=r}offUpdate(e){this.reactIDs=this.reactIDs.filter(r=>r.id!=e)}dispatchUpdate(){this.reactIDs.map(e=>e.callback())}}exports.APIBuilder=I;exports.APIRunner=v;exports.ContextRoute=G;exports.EventBus=F;exports.EventRunner=E;exports.ReactiveClass=M;
