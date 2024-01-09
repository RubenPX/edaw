<script lang="ts">
  import { WorkerInstance } from '$worker/ClientWorkerManager';
  import { onMount } from 'svelte';

  let workerInitialized: Promise<void> | undefined = undefined;
  onMount(() => {
    workerInitialized = WorkerInstance.waitInitialize();
  });
</script>

{#if workerInitialized == null}
  <h2 style="margin: auto; width: 100%; text-align: center; margin: 20px;">Loading app...</h2>
{:else}
  {#await workerInitialized}
    <h2 style="margin: auto; width: 100%; text-align: center; margin: 20px;">Loading app...</h2>
  {:then}
    <slot />
  {/await}
{/if}
