<script lang="ts">
  import { inspectionsStore, addInspection } from '../../../stores/inspectionsStore';
  import { lotesStore } from '../../../stores/lotesStore';
  import { Inspection } from '$lib/models/inspection';
  import { get } from 'svelte/store';
  import { goto } from '$app/navigation'; 


  function enrutador(link: string){
        goto(link);
  }  

  let selectedLoteId: number | null = null;
  let producto = '';
  let inspeccionado = 0;
  let defectuoso = 0;
  let usuario = 'Gerente Administrativo';
  let autoHold = true;

  function submit() {
    if (!selectedLoteId) {
      alert('Seleccione un lote');
      return;
    }
    if (inspeccionado <= 0) {
      alert('El valor inspeccionado debe ser mayor que 0');
      return;
    }
    if (defectuoso < 0 || defectuoso > inspeccionado) {
      alert('Cantidad defectuosa inválida');
      return;
    }

    // Obtener el nombre del producto si no se escribe manualmente
    const nombreProducto =
      producto || get(lotesStore).find(l => l.id === selectedLoteId)?.producto || '';

    // Crear inspección
    const nuevo = new Inspection(
      selectedLoteId,
      nombreProducto,
      inspeccionado,
      defectuoso
    );

    // ❗ GUARDAR LA INSPECCIÓN (lo que faltaba)
    addInspection(nuevo, {
      usuario,
      autoHold
    });

    // Limpiar formulario
    producto = '';
    inspeccionado = 0;
    defectuoso = 0;

    alert("Inspección registrada correctamente");
  }
</script>

<div class="card">

  <h3>Registrar inspección por lote</h3>
  
  <label>Lote</label>
  <select bind:value={selectedLoteId}>
    <option value={null}>-- Seleccione lote --</option>
    {#each $lotesStore as l}
      <option value={l.id}>{l.producto} (#{l.id})</option>
    {/each}
  </select>

  <label>Nombre del Producto (Opcional)</label>
  <input bind:value={producto} placeholder="Nombre del producto" />

  <label>Inspeccionado</label>
  <input type="number" bind:value={inspeccionado} min="0" />

  <label>Defectuoso</label>
  <input type="number" bind:value={defectuoso} min="0" />

  <label>Usuario</label>
  <input bind:value={usuario} />

  <label>
    <input type="checkbox" bind:checked={autoHold} />
    Poner lote en espera automáticamente si supera promedio
  </label>

  <button 
  type = "button"
  onclick={submit} class="btn btn-primary">Registrar inspección</button
  >
</div>

<style>
.card {
  padding: 1rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,.06);
  display:flex;
  flex-direction:column;
  gap:.5rem;
}

</style>
