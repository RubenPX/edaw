import { APIBuilder, type ClientRouteDefinition, ContextRoute, EventBus, type clientRoutesType } from 'edaw';
import { LocalStorageNotesClientContext } from './Notes/infrastructure/LocalStorageRepository';
import type { WorkerManager } from './WorkerManager';
import WorkerThread from './WorkerManager?worker';

// import "./DebugUI";

export class ClientWorkerManager extends EventBus {
  protected routes: { [key: string]: ContextRoute<any>; };

  public Routes!: clientRoutesType<WorkerManager>;

  public initialized = false;

  constructor(worker: Worker, initializedEvent?: (routes: clientRoutesType<ClientWorkerManager>) => void) {
    super(worker);

    console.groupCollapsed('Worker init');

    this.routes = {
      session: new LocalStorageNotesClientContext()
    };

    this.postInitialize();

    this.observe({ context: 'root', method: 'initialized' }, (evMsg) => {
      if (evMsg.returnData) this.Routes = evMsg.returnData;
      else console.warn("Routes request is empty...");
      this.offMessage(evMsg);
      console.groupEnd();
      this.initialized = true;
      initializedEvent && initializedEvent(evMsg.returnData!);
    });
  }

  public instanceBuilder<returnType, paramsType>(route: ClientRouteDefinition<returnType, paramsType>) {
    return new APIBuilder(route, this);
  }

  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  public async waitInitialize() {
    while (!this.initialized) {
      console.log('Initializing...');
      await this.delay(100);
    }
  }

  // eslint-disable-next-line no-use-before-define
  public static instance?: ClientWorkerManager;
  public static getInstance(worker: Worker) {
    if (this.instance == null) this.instance = new ClientWorkerManager(worker);
    return this.instance;
  }
}

export const WorkerInstance = ClientWorkerManager.getInstance(new WorkerThread());