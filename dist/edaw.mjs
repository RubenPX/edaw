var O = Object.defineProperty;
var I = (o, e, r) => e in o ? O(o, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : o[e] = r;
var i = (o, e, r) => (I(o, typeof e != "symbol" ? e + "" : e, r), r);
const p = {
  RoundedBorder: (o) => `border-left: 2px solid ${o}; border-right: 2px solid ${o}; padding: 0 4px; border-radius: 5px; `
}, b = {
  green: "color: #0d0; ",
  blue: "color: #0af; ",
  red: "color: #f20; ",
  orange: "color: #F80; ",
  purple: "color: #d602ee; "
}, W = typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope, f = W ? "W" : "C", g = {
  sendMsg: [`%c${f}⮞`, b.orange + p.RoundedBorder("#F80")],
  reciveMsg: [`%c${f}⮜`, b.green + p.RoundedBorder("#0d0")],
  Error: [`%c${f}⭙`, b.red + p.RoundedBorder("#f20")],
  ObserverRegister: [`%c${f}⭘`, b.purple + p.RoundedBorder("#d602ee")],
  ObserverUnRegister: [`%c${f}⮾`, b.purple + p.RoundedBorder("#d602ee")]
}, d = "padding-left: 5px; padding-right: 5px; padding-top: 2px;", v = "background-color: #38f; border-radius: 100px; color: #000;", E = "background-color: #492; border-radius: 100px; color: #000;", y = "background-color: #fa0; border-radius: 100px; color: #000;", D = "background-color: #f53; border-radius: 100px; color: #000;";
class U {
  static info(e, r = "") {
    return e instanceof Array ? ["%c" + e.join(" | "), `${d} ${v}`, r] : ["%c" + e, `${d} ${v}`, r];
  }
  static warn(e, r = "") {
    return e instanceof Array ? ["%c" + e.join(" | "), `${d} ${D}`, r] : ["%c" + e, `${d} ${D}`, r];
  }
  static yellow(e, r = "") {
    return e instanceof Array ? ["%c" + e.join(" | "), `${d} ${y}`, r] : ["%c" + e, `${d} ${y}`, r];
  }
  static succes(e, r = "") {
    return e instanceof Array ? ["%c" + e.join(" | "), `${d} ${E}`, r] : ["%c" + e, `${d} ${E}`, r];
  }
}
let w;
const j = new Uint8Array(16);
function C() {
  if (!w && (w = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !w))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return w(j);
}
const n = [];
for (let o = 0; o < 256; ++o)
  n.push((o + 256).toString(16).slice(1));
function S(o, e = 0) {
  return n[o[e + 0]] + n[o[e + 1]] + n[o[e + 2]] + n[o[e + 3]] + "-" + n[o[e + 4]] + n[o[e + 5]] + "-" + n[o[e + 6]] + n[o[e + 7]] + "-" + n[o[e + 8]] + n[o[e + 9]] + "-" + n[o[e + 10]] + n[o[e + 11]] + n[o[e + 12]] + n[o[e + 13]] + n[o[e + 14]] + n[o[e + 15]];
}
const B = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), k = {
  randomUUID: B
};
function N(o, e, r) {
  if (k.randomUUID && !e && !o)
    return k.randomUUID();
  o = o || {};
  const t = o.random || (o.rng || C)();
  if (t[6] = t[6] & 15 | 64, t[8] = t[8] & 63 | 128, e) {
    r = r || 0;
    for (let s = 0; s < 16; ++s)
      e[r + s] = t[s];
    return e;
  }
  return S(t);
}
class c {
  constructor(e, r, t) {
    i(this, "id", N());
    i(this, "returnData");
    i(this, "error", !1);
    i(this, "resolved", !1);
    this.context = e, this.method = r, this.params = t;
  }
  static regenerate(e) {
    return new c(e.context, e.method, e.params);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static parseMessageEvent(e) {
    const { id: r, context: t, method: s, params: l, ...h } = e.data;
    if (t && s) {
      const a = new c(t, s, l);
      return a.id = r, a.resolved = h.resolved ?? !1, a.returnData = h.returnData ?? void 0, h.error && (a.error = h.error), a;
    } else {
      const a = new c("", "");
      return a.error = !0, a.returnData = e.data, a;
    }
  }
  static parseErrorEvent(e) {
    const r = new c("", "");
    return r.error = !0, r.returnData = e, r;
  }
}
class x {
}
// @todo: make this variable dependient if is production or not
i(x, "production", !1), i(x, "verbose", {
  worker: {
    observe: !1,
    unObserve: !1,
    showIn: !1,
    showOut: !1
  },
  browser: {
    observe: !1,
    unObserve: !1,
    showIn: !1,
    showOut: !1
  }
});
const u = typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope;
class G {
  constructor(e) {
    i(this, "logger", x);
    i(this, "isWorker", typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope);
    i(this, "handlers", []);
    this.manager = e, e.addEventListener("message", (r) => this.onWorkerMessage(r)), e.addEventListener("error", (r) => this.onWorkerError(r)), e.addEventListener("messageerror", (r) => this.onWorkerMessage(r));
  }
  onWorkerMessage(e) {
    const r = c.parseMessageEvent(e);
    (u && this.logger.verbose.worker.showIn || !u && this.logger.verbose.browser.showIn) && console.debug(...g.reciveMsg, {
      id: { id: r.id },
      context: r.context,
      method: r.method,
      returnData: r.returnData
    }), this.publish(r);
  }
  onWorkerError(e) {
    const r = c.parseErrorEvent(e);
    console.error(...g.Error, { ev: e }), this.publish(r);
  }
  postMessage(e, r = !1) {
    r && (e.resolved = !0), (u && this.logger.verbose.worker.showOut || !u && this.logger.verbose.browser.showOut) && console.debug(...g.sendMsg, {
      id: { id: e.id },
      context: e.context,
      method: e.method,
      returnData: e.returnData
    }), this.manager.postMessage(e);
  }
  publish(e) {
    if (e.resolved)
      return this.dispatchEvent(e);
    const r = Object.values(this.routes).filter((t) => t.contextName === e.context);
    r.length !== 0 ? r.forEach(async (t) => {
      try {
        e.returnData = (await t.runEvent(this, e)).returnData;
      } catch (s) {
        e.error = !0, e.returnData = s;
      }
      this.postMessage(e, !0);
    }) : (e.error = !0, e.returnData = new Error("Route not found"), this.postMessage(e, !0));
  }
  dispatchEvent(e) {
    const r = this.handlers.filter((t) => t.msgEvent.context === e.context && t.msgEvent.method === e.method);
    for (const t of r)
      t.clbk(e);
  }
  offMessage(e) {
    this.handlers = this.handlers.filter((r) => r.msgEvent.id !== e.id), (u && this.logger.verbose.worker.unObserve || !u && this.logger.verbose.browser.unObserve) && console.debug(...g.ObserverUnRegister, e.id);
  }
  onMessage(e, r) {
    const t = e;
    return this.handlers.push({ msgEvent: t, clbk: r }), (u && this.logger.verbose.worker.observe || !u && this.logger.verbose.browser.observe) && console.debug(...g.ObserverRegister, t.id, { context: e.context, method: e.method }), t;
  }
  observe(e, r) {
    const t = new c(e.context, e.method, e.params);
    return this.onMessage(t, r);
  }
  // eslint-disable-next-line max-len
  postReturn(e, r, t) {
    const s = new c(e, r, t), l = new Promise((h, a) => {
      this.onMessage(s, (m) => {
        s.id === m.id && (m.error ? a(m.returnData) : h(m), this.offMessage(s));
      });
    });
    return this.postMessage(s), l;
  }
  async postInitialize() {
    console.groupCollapsed(`${u ? "Worker" : "Client"} route registers`), Object.entries(this.routes).forEach(([r, t]) => {
      Object.entries(t.EventRoutes).forEach(([s, l]) => {
        console.debug(...U.info("routeRegister", { context: t.contextName, method: s }));
      });
    }), console.groupEnd();
    const e = new c("root", "initialized");
    e.returnData = this.getClientRoutes(), e.resolved = !0, this.postMessage(e, !0);
  }
  getClientRoutes() {
    return Object.entries(this.routes).reduce((e, [r, t]) => (e[r] = t.getRoutes(), e), {});
  }
}
class R {
  constructor(e, r) {
    this.repo = e, this.run = r;
  }
  async runMethod(e, r) {
    if (typeof this.repo == "number" && isNaN(this.repo))
      throw new Error("Repository is not initialized");
    return await this.run({ repo: this.repo, params: e.params, bus: r, evMsg: e });
  }
  static prepareEvent(e) {
    return (r) => new R(r ?? NaN, e);
  }
}
class z {
  async runEvent(e, r) {
    const t = Object.entries(this.EventRoutes).find(([l]) => l === r.method);
    if (!t)
      throw new Error("Method not found");
    const s = t[1];
    return r.returnData = await s.run({ repo: this.repos, evMsg: r, params: r.params, bus: e }), r;
  }
  getRoutes() {
    return Object.entries(this.EventRoutes).reduce((e, [r, t]) => (e[r] = { context: this.contextName, method: r }, e), {});
  }
}
class A {
  constructor(e, r) {
    i(this, "filters", {});
    i(this, "sorter", null);
    this.route = e, this.client = r;
  }
  setFilter(e, r) {
    this.filters[e] = r;
  }
  removeFilter(e) {
    this.filters = Object.fromEntries(Object.entries(this.filters).filter((r) => r[0] !== e));
  }
  sort(e) {
    this.sorter = e;
  }
  getFilters() {
    return this.filters;
  }
  getSort() {
    return this.sorter;
  }
}
class $ {
  constructor(e) {
    this.builder = e;
  }
  observe(e) {
    const r = this.builder.client.observe({
      context: this.builder.route.context,
      method: this.builder.route.method,
      params: this.builder.route.params
    }, e);
    return {
      postEvent: (t) => this.postObserveMessage(r, t),
      removeObserver: () => this.builder.client.offMessage(r)
    };
  }
  async postObserveMessage(e, r) {
    e.params = r, this.builder.client.postMessage(e);
  }
  async run(e) {
    return (await this.builder.client.postReturn(
      this.builder.route.context,
      this.builder.route.method,
      e
    )).returnData;
  }
  static instanceBasic(e, r) {
    const t = new A(r, e);
    return new $(t);
  }
}
class V {
  constructor() {
    i(this, "reactIDs", []);
  }
  onUpdate(e, r) {
    const t = this.reactIDs.findIndex((s) => s.id == e);
    if (t == -1) {
      this.reactIDs.push({ id: e, callback: r });
      return;
    }
    this.reactIDs[t].callback = r;
  }
  offUpdate(e) {
    this.reactIDs = this.reactIDs.filter((r) => r.id != e);
  }
  dispatchUpdate() {
    this.reactIDs.map((e) => e.callback());
  }
}
export {
  A as APIBuilder,
  $ as APIRunner,
  z as ContextRoute,
  G as EventBus,
  c as EventMessage,
  R as EventRunner,
  V as ReactiveClass,
  u as isWorker
};
