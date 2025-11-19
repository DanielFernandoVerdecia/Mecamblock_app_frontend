<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  // Declaramos que este componente despacha un evento "change" con { value: string }
  const dispatch = createEventDispatcher<{ change: { value: string } }>();

  export let placeholder = 'Buscar...';
  let value = '';

  function handleInput(e: Event) {
    value = (e.target as HTMLInputElement).value;
    dispatch('change', { value });
  }
</script>

<input
  type="text"
  bind:value
  placeholder={placeholder}
  on:input={handleInput}
/>
