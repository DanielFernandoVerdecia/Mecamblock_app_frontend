<script lang="ts">
  import { onDestroy } from 'svelte';
  import { entregasStore } from '../../stores/entregasStore';
  import { Entrega } from '$lib/models/entrega';
  import ModalConfirm from '$lib/components/ModalConfirm.svelte';
  import SearchFilter from '$lib/components/SearchFilter.svelte';

  // Form state
  let cliente = '';
  let documento = '';
  let editingId: number | null = null;
  let errors: string[] = [];

  let list: Entrega[] = [];
  const unsub = entregasStore.subscribe(v => list = v as Entrega[]);
  onDestroy(() => unsub());

  // Filter
  let q = '';
  function onFilter(e: CustomEvent) { q = e.detail.value; }

  function validate() {
    errors = [];
    const c = cliente.trim();
    if (!c) errors.push('Cliente es requerido');
    if (c.length > 100) errors.push('Cliente demasiado largo');
    return errors.length === 0;
  }

  function add() {
    if (!validate()) return;
    const e = new Entrega(cliente.trim(), documento.trim() || undefined);
    entregasStore.add(e);
    cliente = '';
    documento = '';
  }

  function startEdit(item: Entrega) {
    editingId = item.id;
    cliente = item.cliente;
    documento = item.documento || '';
  }

  function saveEdit() {
    if (editingId === null || !validate()) return;
    entregasStore.replace(
      x => x.id === editingId,
      x => ({ ...x, cliente: cliente.trim(), documento: documento.trim() || undefined, fechaModificacion: new Date().toISOString() })
    );
    editingId = null;
    cliente = '';
    documento = '';
  }

  // delete modal
  let showModal = false;
  let idToDelete: number | null = null;
  function askDelete(id: number) { idToDelete = id; showModal = true; }
  function confirmDelete() {
    if (idToDelete !== null) entregasStore.remove(x => x.id === idToDelete);
    showModal = false;
    idToDelete = null;
  }
  function cancelDelete() {
    showModal = false;
    idToDelete = null;
  }

  $: filtered = list.filter(it => !q || it.cliente.toLowerCase().includes(q.toLowerCase()));
</script>

<h1>HU01 - Comprobante de entrega</h1>
<section>
  <form on:submit|preventDefault={editingId ? saveEdit : add}>
    {#if errors.length}
      <ul class="err">{#each errors as e}<li>{e}</li>{/each}</ul>
    {/if}
    <input placeholder="Cliente" bind:value={cliente} />
    <input placeholder="Documento (opcional)" bind:value={documento} />
    <button type="submit">{editingId ? 'Guardar' : 'Registrar'}</button>
    {#if editingId}
      <button type="button" on:click={() => { editingId = null; cliente = ''; documento = ''; }}>Cancelar</button>
    {/if}
  </form>

  <SearchFilter placeholder="Buscar por cliente" on:change={onFilter} />

  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Cliente</th>
        <th>Documento</th>
        <th>Estado</th>
        <th>Creación</th>
        <th>Modificación</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {#each filtered as it}
        <tr>
          <td>{it.id}</td>
          <td>{it.cliente}</td>
          <td>{it.documento ?? '-'}</td>
          <td>{it.estado}</td>
          <td>{new Date(it.fechaCreacion).toLocaleString()}</td>
          <td>{it.fechaModificacion ? new Date(it.fechaModificacion).toLocaleString() : '-'}</td>
          <td>
            <button
              on:click={() =>
                entregasStore.replace(
                  x => x.id === it.id,
                  x => ({ ...x, estado: x.estado === 'pendiente' ? 'entregado' : x.estado === 'entregado' ? 'finalizado' : x.estado, fechaModificacion: new Date().toISOString() })
                )
              }
            >
              Cambiar estado
            </button>
            <button on:click={() => startEdit(it)}>Editar</button>
            <button on:click={() => askDelete(it.id)}>Eliminar</button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>

  {#if showModal}
    <ModalConfirm title="Eliminar comprobante" message="¿Eliminar este comprobante?" on:confirm={confirmDelete} on:cancel={cancelDelete} />
  {/if}
</section>

<style>
  .err { color: red; margin: 8px 0; }
  table { width: 100%; border-collapse: collapse; margin-top: 12px; }
  th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
  button { margin-right: 6px; }
</style>
