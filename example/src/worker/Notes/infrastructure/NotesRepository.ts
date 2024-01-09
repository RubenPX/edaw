import { LocalStorageNotesRepository } from "./LocalStorageRepository";
import type { Note } from "../domain/Note";
import type { NotesRepository } from "../domain/NotesRepository";
import { ReactiveClass } from "edaw";

export class NotesRepo extends ReactiveClass implements NotesRepository {
  public notes: undefined | null | Note[] = undefined;
  constructor(public localStorageDB: LocalStorageNotesRepository) { 
    super();
  }
  
  async addNote(data: Note) {
    const notes = await this.get();

    const newNote = {
      ...data,
      id        : notes.length,
      createdAt : new Date()
    };

    notes.push(newNote);

    this.dispatchUpdate();

    return newNote;
  }

  async removeNote(id: number) {
    const notes = await this.get();

    const indexNote = notes.findIndex(itm => itm.id == id);
    if (indexNote === -1) throw new Error(`Note with id ${id} not found`);

    this.dispatchUpdate();
  }

  async modifyNote(id: number, data: Note) {
    const notes = await this.get();

    const indexNote = notes.findIndex(itm => itm.id == id);
    if (indexNote === -1) throw new Error(`Note with id ${id} not found`);

    notes[indexNote] = {
      ...data,
      id        : notes[indexNote].id,
      createdAt : notes[indexNote].createdAt
    };

    this.dispatchUpdate();

    return notes[indexNote];
  }

  async get(): Promise<Note[]> {
    // Get notes from client local storage
    if (this.notes === undefined) this.notes = await this.localStorageDB.get();
    return this.notes ?? [];
  }

  set(data: Note[]): void {
   this.notes = data;

   // Set notes from client local storage
   this.localStorageDB.set(data);

   this.dispatchUpdate();
  }

}