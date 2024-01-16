<script lang="ts">
  import ColorPicker from './ColorPicker.svelte';
  import { WorkerInstance } from '$worker/ClientWorkerManager';

  let title: string = '';
  let value: string = '';
  let color: string;

  let handleClick = () => {
    WorkerInstance.instanceRunner(WorkerInstance.Routes.Notes.NewNote).run({
      title,
      text: value,
      color,
    });

    title = '';
    value = '';
  };
</script>

<div class="note-editor" style="--color: {color}">
  <input placeholder="Enter note title..." bind:value={title} />
  <textarea placeholder="Enter your note here..." rows={5} bind:value />
  <div style="display: flex; justify-content: space-between; width: 100%">
    <ColorPicker bind:color />
    <button class="add-btn" on:click={handleClick}>Add</button>
  </div>
</div>

<style>
  input {
    font-size: 20px;
  }

  textarea,
  input {
    background-color: var(--color, #fff);
    width: 100%;
    border: none;
    resize: none;
  }

  textarea::placeholder,
  input::placeholder {
    color: #555;
  }

  textarea:focus,
  input:focus {
    outline: 0;
  }

  .note-editor {
    background-color: var(--color, #fff);
    display: block;
    width: 100%;
    max-width: 600px;
    margin: auto;
    padding: 16px;
    border-radius: 10px;
  }

  button {
    background-color: #fff;
    border: none;
    border-radius: 10px;
    padding: 5px 20px;
    cursor: pointer;
  }

  button:hover {
    background-color: #eaeaea;
  }
</style>
