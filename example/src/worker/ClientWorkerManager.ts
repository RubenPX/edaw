import { ContextRoute, EventBus, type clientRoutesType } from 'edaw';
import { LocalStorageNotesClientContext } from './utils/client/LocalStorageRepository';
import type { Logger } from '../../../src/Console/Logger';
import { PrivateLogger } from './Logger';
import type { WorkerManager } from './WorkerManager';
import WorkerThread from './WorkerManager?worker';

// Nota: Esto se ejecuta en el navegador, no en el worker

export class ClientWorkerManager extends EventBus {
  protected routes: { [key: string]: ContextRoute<any>; };

  protected logger: typeof Logger = PrivateLogger;

  public Routes!: clientRoutesType<WorkerManager>;

  public initialized = false;

  constructor(worker: Worker, initializedEvent?: (routes: clientRoutesType<ClientWorkerManager>) => void) {
    super(worker);

    console.groupCollapsed('Worker init');

    this.routes = {
      session: new LocalStorageNotesClientContext()
    };

    this.postInitialize();
    
    // @ts-expect-error This to expose WorkerManager
    window.EDAW = this;

    const msgEV = this.observe({ context: 'root', method: 'initialized' }, (evMsg) => {
      if (evMsg.returnData) this.Routes = evMsg.returnData;
      else console.warn("Routes request is empty...");
      this.offMessage(msgEV);
      console.groupEnd();
      this.initialized = true;
      initializedEvent && initializedEvent(evMsg.returnData!);
    });
  }

  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  public async waitInitialize() {
    while (!this.initialized) {
      console.log('Initializing...');
      await this.delay(100);
    }
  }

  // eslint-disable-next-line no-use-before-define
  public static instance?: ClientWorkerManager & EventBus;
  public static getInstance(worker: Worker) {
    if (this.instance == null) this.instance = new ClientWorkerManager(worker);
    return this.instance;
  }
}

export const WorkerInstance = ClientWorkerManager.getInstance(new WorkerThread());