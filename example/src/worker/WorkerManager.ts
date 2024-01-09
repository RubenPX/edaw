import { EventBus } from "edaw";

// Repos
import { LocalStorageNotesRepository } from "./Notes/infrastructure/LocalStorageRepository";

// Routes
import { NotesFeature } from "./Notes";

export class WorkerManager extends EventBus {
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
