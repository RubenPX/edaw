<script lang="ts">
  import { ClientWorkerManager, WorkerInstance } from '$worker/ClientWorkerManager';
  import type { Note } from '$worker/Notes/domain/Note';
  import { onMount } from 'svelte';
  import NoteComponent from './Note.svelte';
  import { APIRunner, EventRunner } from '../../../../src';

  let notes: Note[] = [];

  onMount(() => {
    let buildedInstance = APIRunner.instanceBasic(WorkerInstance, WorkerInstance.Routes.Notes.GetNotes);

    let observer = buildedInstance.observe(({ returnData }) => {
      notes = returnData ?? [];
    });

    observer.postEvent();
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
