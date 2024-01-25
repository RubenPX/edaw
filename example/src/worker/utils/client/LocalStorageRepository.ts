import { ContextRoute, EventRunner } from "edaw";
import type { Note } from "$worker/Notes/domain/Note";
import type { NotesRepository } from "$worker/Notes/domain/NotesRepository";


class ClientLocalStorage {
  public static GetNotesEvent = EventRunner.prepareEvent<Note[] | null, undefined, undefined>(async () => {
    const data = localStorage.getItem("AppNotes");
    if (data) return JSON.parse(data);
    return null;
  });

  public static SetNotesEvent = EventRunner.prepareEvent<undefined, Note[], undefined>(async ({ params }) => {
    if (params) localStorage.setItem("AppNotes", JSON.stringify(params));
  });
}

export class LocalStorageNotesClientContext extends ContextRoute<NotesRepository>{

  public repos = undefined;

  public EventRoutes = { 
    LoadNotes : ClientLocalStorage.GetNotesEvent(this.repos),
    SaveNotes : ClientLocalStorage.SetNotesEvent(this.repos)
  };

  public contextName: string = "NotesRepo";
}
