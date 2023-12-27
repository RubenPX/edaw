import { EventBus } from "edaw";

// Repos
import { CounterFeature } from "./Counter/CounterFeature";

// Routes
import { CounterMemory } from "./Counter/infrastructure/CounterMemory";

export class WorkerManager extends EventBus {
  protected routes!: {
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

    bus.postInitialize();
  }
}

async function initializeWorker() {
  
  if (typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope) {
    await WorkerManager.initialize(self as unknown as Worker);
  }
}

try {
  initializeWorker();
} catch (error) {
  console.error(error);
}
