<script lang="ts">
    import { lotesStore } from '../../../stores/lotesStore';
</script>

<div class="card">
    <h2>Lotes producidos</h2>

    {#if $lotesStore.length === 0}
        <p>No hay lotes registrados.</p>
    {/if}

    {#each $lotesStore as lote}
        <div class="item">
            <strong>Producto:</strong> {lote.producto}<br>
            <strong>Cantidad:</strong> {lote.cantidad}<br>
            <strong>Estado:</strong> {lote.estado}<br>
            <small>Fecha: {new Date(lote.fechaCreacion).toLocaleString()}</small>
        </div>
    {/each}
</div>

<style>
.card {
    padding: 1rem;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,.1);
}
.item {
    padding: .5rem;
    border-bottom: 1px solid #ddd;
    margin-bottom: .5rem;
}
</style>
