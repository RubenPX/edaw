import { ContextRoute } from "edaw";
import type { LocalStorageNotesRepository } from "./infrastructure/LocalStorageRepository";
import { NotesRepo } from "./infrastructure/NotesRepository";
import type { NotesRepository } from "./domain/NotesRepository";

// Routes
import { GetNotes } from "./app/GetNotes";
import { NewNote } from "./app/NewNote";
import { RemoveNote } from "./app/RemoveNote";

export class NotesFeature extends ContextRoute<NotesRepository> {
  public contextName: string = 'Notes';

  public repos: NotesRepository;
  public EventRoutes;
  
  constructor(public localStoarageDB: LocalStorageNotesRepository) {
    super();

    this.repos = new NotesRepo(localStoarageDB);

    this.EventRoutes = {
      GetNotes   : GetNotes(),
      NewNote    : NewNote(),
      RemoveNote : RemoveNote()
    };
  }
}