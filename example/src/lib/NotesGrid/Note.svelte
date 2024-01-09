<script lang="ts">
  import { WorkerInstance } from '$worker/ClientWorkerManager';
  import type { Note } from '$worker/Notes/domain/Note';
  import { APIRunner } from '../../../../src';

  export let note: Note;

  const removeNoteHandle = (id: number) => {
    let noteRemover = APIRunner.instanceBasic(WorkerInstance, WorkerInstance.Routes.Notes.RemoveNote);
    noteRemover.run({ id });
  };
</script>

<section class="note" style="--color: {note.color}">
  <h3>{note.title} <button class="delete-btn" on:click={() => removeNoteHandle(note.id)}>X</button></h3>
  <p>{note.text}</p>
</section>

<style>
  h3,
  p {
    padding: 0;
    margin: 0;
    width: 100%;
  }

  .note {
    float: left;
    padding: 10px;
    margin: 10px;
    background-color: var(--color);
    border-radius: 10px;
    width: 250px;
    justify-content: center;
    align-items: center;
  }

  .delete-btn {
    float: right;
    background-color: #0005;
    border: none;
    border-radius: 7px;
    cursor: pointer;
  }

  .delete-btn:hover {
    background-color: #0003;
  }
</style>
