<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let title = 'Confirmar';
  export let message = '';

  // Tipamos los eventos confirm y cancel (sin payload)
  const dispatch = createEventDispatcher<{ confirm: void; cancel: void }>();

  function confirm() {
    dispatch('confirm');
  }

  function cancel() {
    dispatch('cancel');
  }
</script>

<div class="overlay" role="dialog" aria-modal="true">
  <div class="modal">
    <h3>{title}</h3>
    <p>{message}</p>

    <div class="actions">
      <button class="danger" on:click={confirm}>Sí, eliminar</button>
      <button class="secondary" on:click={cancel}>Cancelar</button>
    </div>
  </div>
</div>

<style>
  /* ... tu CSS (sin cambios) ... */
  .overlay { position: fixed; inset: 0; background: #0008; display: flex; justify-content: center; align-items: center; z-index: 50; }
  .modal { background: white; padding: 20px; width: 320px; border-radius: 10px; box-shadow: 0 3px 10px #0005; }
  .actions { margin-top: 20px; display:flex; justify-content: space-between; }
  button { padding: 7px 14px; border-radius: 6px; cursor: pointer; border: none; }
  .danger { background: #d9534f; color: white; }
  .secondary { background: #ccc; }
</style>
