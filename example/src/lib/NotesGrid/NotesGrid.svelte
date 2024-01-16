<script lang="ts">
  import { WorkerInstance } from '$worker/ClientWorkerManager';
  import type { Note } from '$worker/Notes/domain/Note';
  import { onMount } from 'svelte';
  import NoteComponent from './Note.svelte';

  let notes: Note[] = [];

  onMount(() => {
    WorkerInstance.instanceRunner(WorkerInstance.Routes.Notes.GetNotes)
      .observe(({ returnData }) => (notes = returnData ?? []))
      .postEvent();
  });
</script>

<section class="notes">
  {#each notes as item}
    <NoteComponent note={item} />
  {/each}
</section>

<style>
  .notes {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
</style>
