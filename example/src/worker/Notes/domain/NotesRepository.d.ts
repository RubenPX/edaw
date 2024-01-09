import type { Note } from "./Note";

export interface NotesRepository {
  get(onUpdate: (notes?: Note[]) => void): Promise<Note[] | null>
  set(data: Note[]): void
  addNote(data: Omit<Note, 'id' | 'createAt'>): Promise<Note>
  removeNote(id: number)
}