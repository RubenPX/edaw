var edaw=function(i){"use strict";var F=Object.defineProperty;var G=(i,a,u)=>a in i?F(i,a,{enumerable:!0,configurable:!0,writable:!0,value:u}):i[a]=u;var c=(i,a,u)=>(G(i,typeof a!="symbol"?a+"":a,u),u);const a={RoundedBorder:o=>`border-left: 2px solid ${o}; border-right: 2px solid ${o}; padding: 0 4px; border-radius: 5px; `},u={green:"color: #0d0; ",blue:"color: #0af; ",red:"color: #f20; ",orange:"color: #F80; ",purple:"color: #d602ee; "},g=typeof WorkerGlobalScope<"u"&&self instanceof WorkerGlobalScope?"W":"C",m={sendMsg:[`%c${g}⮞`,u.orange+a.RoundedBorder("#F80")],reciveMsg:[`%c${g}⮜`,u.green+a.RoundedBorder("#0d0")],Error:[`%c${g}⭙`,u.red+a.RoundedBorder("#f20")],ObserverRegister:[`%c${g}⭘`,u.purple+a.RoundedBorder("#d602ee")],ObserverUnRegister:[`%c${g}⮾`,u.purple+a.RoundedBorder("#d602ee")]},h="padding-left: 5px; padding-right: 5px; padding-top: 2px;",R="background-color: #38f; border-radius: 100px; color: #000;",D="background-color: #492; border-radius: 100px; color: #000;",k="background-color: #fa0; border-radius: 100px; color: #000;",$="background-color: #f53; border-radius: 100px; color: #000;";class W{static info(e,r=""){return e instanceof Array?["%c"+e.join(" | "),`${h} ${R}`,r]:["%c"+e,`${h} ${R}`,r]}static warn(e,r=""){return e instanceof Array?["%c"+e.join(" | "),`${h} ${$}`,r]:["%c"+e,`${h} ${$}`,r]}static yellow(e,r=""){return e instanceof Array?["%c"+e.join(" | "),`${h} ${k}`,r]:["%c"+e,`${h} ${k}`,r]}static succes(e,r=""){return e instanceof Array?["%c"+e.join(" | "),`${h} ${D}`,r]:["%c"+e,`${h} ${D}`,r]}}let w;const U=new Uint8Array(16);function C(){if(!w&&(w=typeof crypto<"u"&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!w))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return w(U)}const s=[];for(let o=0;o<256;++o)s.push((o+256).toString(16).slice(1));function j(o,e=0){return s[o[e+0]]+s[o[e+1]]+s[o[e+2]]+s[o[e+3]]+"-"+s[o[e+4]]+s[o[e+5]]+"-"+s[o[e+6]]+s[o[e+7]]+"-"+s[o[e+8]]+s[o[e+9]]+"-"+s[o[e+10]]+s[o[e+11]]+s[o[e+12]]+s[o[e+13]]+s[o[e+14]]+s[o[e+15]]}const I={randomUUID:typeof crypto<"u"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};function S(o,e,r){if(I.randomUUID&&!e&&!o)return I.randomUUID();o=o||{};const t=o.random||(o.rng||C)();if(t[6]=t[6]&15|64,t[8]=t[8]&63|128,e){r=r||0;for(let n=0;n<16;++n)e[r+n]=t[n];return e}return j(t)}class d{constructor(e,r,t){c(this,"id",S());c(this,"returnData");c(this,"error",!1);c(this,"resolved",!1);this.context=e,this.method=r,this.params=t}static regenerate(e){return new d(e.context,e.method,e.params)}static parseMessageEvent(e){const{id:r,context:t,method:n,params:f,...b}=e.data;if(t&&n){const l=new d(t,n,f);return l.id=r,l.resolved=b.resolved??!1,l.returnData=b.returnData??void 0,b.error&&(l.error=b.error),l}else{const l=new d("","");return l.error=!0,l.returnData=e.data,l}}static parseErrorEvent(e){const r=new d("","");return r.error=!0,r.returnData=e,r}}class v{}c(v,"production",!1),c(v,"verbose",{worker:{showIn:!1,showOut:!1},browser:{showIn:!1,showOut:!1}});const p=typeof WorkerGlobalScope<"u"&&self instanceof WorkerGlobalScope;class B{constructor(e){c(this,"logger",v);c(this,"isWorker",typeof WorkerGlobalScope<"u"&&self instanceof WorkerGlobalScope);c(this,"handlers",[]);this.manager=e,e.addEventListener("message",r=>this.onWorkerMessage(r)),e.addEventListener("error",r=>this.onWorkerError(r)),e.addEventListener("messageerror",r=>this.onWorkerMessage(r))}onWorkerMessage(e){const r=d.parseMessageEvent(e);(p&&this.logger.verbose.worker.showIn||!p&&this.logger.verbose.browser.showIn)&&console.debug(...m.reciveMsg,{id:{id:r.id},context:r.context,method:r.method,returnData:r.returnData}),this.publish(r)}onWorkerError(e){const r=d.parseErrorEvent(e);console.error(...m.Error,{ev:e}),this.publish(r)}postMessage(e,r=!1){r&&(e.resolved=!0),(p&&this.logger.verbose.worker.showOut||!p&&this.logger.verbose.browser.showOut)&&console.debug(...m.sendMsg,{id:{id:e.id},context:e.context,method:e.method,returnData:e.returnData}),this.manager.postMessage(e)}publish(e){if(e.resolved)return this.dispatchEvent(e);const r=Object.values(this.routes).filter(t=>t.contextName===e.context);r.length!==0?r.forEach(async t=>{try{e.returnData=(await t.runEvent(this,e)).returnData}catch(n){e.error=!0,e.returnData=n}this.postMessage(e,!0)}):(e.error=!0,e.returnData=new Error("Route not found"),this.postMessage(e,!0))}dispatchEvent(e){const r=this.handlers.filter(t=>t.msgEvent.context===e.context&&t.msgEvent.method===e.method);for(const t of r)t.clbk(e)}offMessage(e){this.handlers=this.handlers.filter(r=>r.msgEvent.id!==e.id),console.debug(...m.ObserverUnRegister,e.id)}onMessage(e,r){const t=e;return this.handlers.push({msgEvent:t,clbk:r}),console.debug(...m.ObserverRegister,t.id,{context:e.context,method:e.method}),t}observe(e,r){const t=new d(e.context,e.method,e.params);return this.onMessage(t,r)}postReturn(e,r,t){const n=new d(e,r,t),f=new Promise((b,l)=>{this.onMessage(n,E=>{n.id===E.id&&(E.error?l(E.returnData):b(E),this.offMessage(n))})});return this.postMessage(n),f}async postInitialize(){console.groupCollapsed(`${p?"Worker":"Client"} route registers`),Object.entries(this.routes).forEach(([r,t])=>{Object.entries(t.EventRoutes).forEach(([n,f])=>{console.debug(...W.info("routeRegister",{context:t.contextName,method:n}))})}),console.groupEnd();const e=new d("root","initialized");e.returnData=this.getClientRoutes(),e.resolved=!0,this.postMessage(e,!0)}getClientRoutes(){return Object.entries(this.routes).reduce((e,[r,t])=>(e[r]=t.getRoutes(),e),{})}}class x{constructor(e,r){this.repo=e,this.run=r}async runMethod(e,r){if(typeof this.repo=="number"&&isNaN(this.repo))throw new Error("Repository is not initialized");return await this.run({repo:this.repo,params:e.params,bus:r,evMsg:e})}static prepareEvent(e){return r=>new x(r??NaN,e)}}class A{async runEvent(e,r){const t=Object.entries(this.EventRoutes).find(([f])=>f===r.method);if(!t)throw new Error("Method not found");const n=t[1];return r.returnData=await n.run({repo:this.repos,evMsg:r,params:r.params,bus:e}),r}getRoutes(){return Object.entries(this.EventRoutes).reduce((e,[r,t])=>(e[r]={context:this.contextName,method:r},e),{})}}class O{constructor(e,r){c(this,"filters",{});c(this,"sorter",null);this.route=e,this.client=r}setFilter(e,r){this.filters[e]=r}removeFilter(e){this.filters=Object.fromEntries(Object.entries(this.filters).filter(r=>r[0]!==e))}sort(e){this.sorter=e}getFilters(){return this.filters}getSort(){return this.sorter}}class y{constructor(e){this.builder=e}observe(e){const r=this.builder.client.observe({context:this.builder.route.context,method:this.builder.route.method,params:this.builder.route.params},e);return{postEvent:t=>this.postObserveMessage(r,t),removeObserver:()=>this.builder.client.offMessage(r)}}async postObserveMessage(e,r){e.params=r,this.builder.client.postMessage(e)}async run(e){return(await this.builder.client.postReturn(this.builder.route.context,this.builder.route.method,e)).returnData}static instanceBasic(e,r){const t=new O(r,e);return new y(t)}}class N{constructor(){c(this,"reactIDs",[])}onUpdate(e,r){const t=this.reactIDs.findIndex(n=>n.id==e);if(t==-1){this.reactIDs.push({id:e,callback:r});return}this.reactIDs[t].callback=r}offUpdate(e){this.reactIDs=this.reactIDs.filter(r=>r.id!=e)}dispatchUpdate(){this.reactIDs.map(e=>e.callback())}}return i.APIBuilder=O,i.APIRunner=y,i.ContextRoute=A,i.EventBus=B,i.EventMessage=d,i.EventRunner=x,i.ReactiveClass=N,i.isWorker=p,Object.defineProperty(i,Symbol.toStringTag,{value:"Module"}),i}({});
