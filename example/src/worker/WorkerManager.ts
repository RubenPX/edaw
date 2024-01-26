import { EventBus } from "edaw";
import type { Logger } from "../../../src/Console/Logger";

// Repos
import { LocalStorageNotesRepository } from "./Notes/infrastructure/LocalStorageRepository";

// Routes
import { NotesFeature } from "./Notes";
import { PrivateLogger } from "./Logger";

export class WorkerManager extends EventBus {
  protected logger: typeof Logger = PrivateLogger;

  protected routes!: {
    Notes: NotesFeature;
  };

  private constructor(worker: Worker) {
    super(worker);
  }

  private static async initializeDBs(bus: EventBus) {
    const LocalStorageRepo = new LocalStorageNotesRepository(bus);

    return { LocalStorageRepo };
  }

  public static async initialize(worker: Worker) {
    const bus = new WorkerManager(worker);
    const dbs = await this.initializeDBs(bus);

    bus.routes = {
      Notes: new NotesFeature(dbs.LocalStorageRepo),
    } satisfies WorkerManager["routes"];

    bus.postInitialize();
    
    // @ts-expect-error This to expose WorkerManager
    self.EDAW = bus;
  }
}

async function initializeWorker() {
  try {
    if (typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope) {
      await WorkerManager.initialize(self as unknown as Worker);
    }
  } catch (error) {
    console.error(error);
  }
}

initializeWorker();