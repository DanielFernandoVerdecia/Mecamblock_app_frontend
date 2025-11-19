<script lang="ts">
    import { defectosStore } from '../../../stores/defectosStore';
    import { lotesStore } from '../../../stores/lotesStore';
    import { Defecto } from '$lib/models/defecto';
    import { get } from 'svelte/store';

    let loteId: number | null = null;
    let producto = '';
    let descripcion = '';
    let gravedad: 'baja'|'media'|'alta' = 'baja';

    function guardar() {
        if (!loteId) {
            alert('Selecciona un lote');
            return;
        }
        const nuevo = new Defecto(loteId, producto, descripcion, gravedad);
        defectosStore.add(nuevo);

        producto = '';
        descripcion = '';
        gravedad = 'baja';
        alert('Defecto registrado');
    }
</script>

<div class="card">
    <h2>Registrar Defecto</h2>

    <label>Lote</label>
    <select bind:value={loteId}>
        <option value={null}>-- Seleccione un lote --</option>
        {#each $lotesStore as lote}
            <option value={lote.id}>{lote.nombre} (#{lote.id})</option>
        {/each}
    </select>

    <label>Producto</label>
    <input bind:value={producto} />

    <label>Descripción</label>
    <textarea bind:value={descripcion}></textarea>

    <label>Gravedad</label>
    <select bind:value={gravedad}>
        <option value="baja">Baja</option>
        <option value="media">Media</option>
        <option value="alta">Alta</option>
    </select>

    <button on:click={guardar}>Guardar</button>
</div>

<style>
.card {
    padding: 1rem;
    border-radius: 8px;
    background: white;
    box-shadow: 0 2px 8px rgba(0,0,0,.1);
}
</style>
