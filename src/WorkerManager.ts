/* eslint-disable no-use-before-define */
import { ConsoleFormatter } from "./Console/Formatters";
import { EventBus } from "./Routes/EventBus";
import { EventMessage } from "./Event/EventMessage";

// Typescript definition autocomplete
import type { clientDefs } from "./Routes/ContextRoute";

// Repos
import { CounterFeature } from "../Counter/CounterFeature";

// Routes
import { CounterMemory } from "../Counter/infrastructure/CounterMemory";

// If you remove this line, inellisense will not work
// eslint-disable-next-line no-use-before-define
export type clientRoutesType = {
  [key in keyof WorkerManager["routes"]]: clientDefs<
    WorkerManager["routes"][key]
  >;
};

export class WorkerManager extends EventBus {
  public routes!: {
    CounterFeature: CounterFeature;
  };

  private constructor(worker: Worker) {
    super(worker);
  }

  private static async initializeDBs(bus: EventBus) {
    const counterMemory = new CounterMemory();

    return { counterMemory };
  }

  public static async initialize(worker: Worker) {
    const bus = new WorkerManager(worker);

    const dbs = await this.initializeDBs(bus);

    bus.routes = {
      CounterFeature: new CounterFeature(dbs.counterMemory),
    } satisfies WorkerManager["routes"];

    bus.initialize();
  }

  private async initialize() {
    // Register all evento to be routed
    console.groupCollapsed("Worker route registers");

    Object.entries(this.routes).forEach(([_, ctx]) => {
      Object.entries(ctx.EventRoutes).forEach(([methodName, _]) => {
        console.debug(
          ...ConsoleFormatter.info("routeRegister", {
            context: ctx.contextName,
            method: methodName,
          })
        );
      });
    });
    console.groupEnd();

    // Register routes on client
    const initializedEvent = new EventMessage("root", "initialized");
    initializedEvent.returnData = this.getClientRoutes();
    initializedEvent.resolved = true;
    this.postMessage(initializedEvent, true);
  }

  public getClientRoutes(): clientRoutesType {
    return Object.entries(this.routes).reduce(
      (arr: clientRoutesType, [ctxName, ctx]) => {
        // @ts-expect-error ctxName alwais will be a index of arr
        arr[ctxName] = ctx.getRoutes();
        return arr;
      },
      {} as clientRoutesType
    );
  }
}

async function initializeWorker() {
  // eslint-disable-next-line no-undef
  if (
    typeof WorkerGlobalScope !== "undefined" &&
    self instanceof WorkerGlobalScope
  ) {
    await WorkerManager.initialize(self as unknown as Worker);
  }
}

try {
  initializeWorker();
} catch (error) {
  console.error(error);
}
