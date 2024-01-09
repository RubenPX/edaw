<script lang="ts">
  const colors = ['#F06292', '#BA68C8', '#FFD54F', '#AED581', '#4FC3F7'];

  export let color: string = '#4FC3F7';
</script>

<div class="color-picker">
  {#each colors as item}
    {#if item != color}
      <button class="color-item" style="--color: {item};" on:click={() => (color = item)} />
    {/if}
  {/each}
</div>

<style>
  .color-picker {
    display: flex;
    gap: 10px;
  }

  .color-item {
    background-color: var(--color);
    height: 20px;
    width: 20px;
    border: none;
    border-radius: 100%;
    cursor: pointer;
  }
</style>
