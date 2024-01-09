<script lang="ts">
  import NoteEditor from '$lib/NoteEditor/NoteEditor.svelte';
  import NotesGrid from '$lib/NotesGrid/NotesGrid.svelte';
</script>

<main>
  <div class="notes-app">
    <h2 class="app-header">NotesApp</h2>

    <!-- <NoteSearch /> -->
    <NoteEditor />
    <NotesGrid />

    <footer>
      <span style="margin-right: 3px;">App base from:</span>
      <a href="https://codepen.io/olyaorange/pen/dRbYNe?editors=0110">React Simple Notes App</a>
    </footer>
  </div>
</main>

<style>
  .app-header {
    width: 100%;
    max-width: 600px;
    margin: auto;
    padding: 16px 0;
  }
  .notes-app {
    max-width: 1200px;
    width: 100%;
    margin: auto;
  }

  main {
    padding: 20px;
  }

  footer {
    display: flex;
    justify-content: center;
    position: absolute;
    margin: auto;
    width: 100%;
    left: 0;
    bottom: 0;
  }
</style>
