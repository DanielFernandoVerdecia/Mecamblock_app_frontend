<script lang="ts">
    import { lotesStore } from '../../../stores/lotesStore';
    import { stockStore } from '../../../stores/stockStore';
    import { Lote } from '$lib/models/lote';
    import { get } from 'svelte/store';

    let producto = '';
    let cantidad: number = 0;

    function agregarLote() {
        if (!producto || cantidad <= 0) {
            alert("Complete los campos correctamente");
            return;
        }

        // 1️ Crear el lote
        const nuevoLote = new Lote(producto, cantidad);
        lotesStore.add(nuevoLote);

        // 2️ Actualizar stock
        const stockActual = get(stockStore);
        const existente = stockActual.find(x => x.nombre === producto);

        if (existente) {
            // Actualizar cantidad del inventario existente
            stockStore.replace(
                s => s.id === existente.id,
                s => ({
                    ...s,
                    cantidad: s.cantidad + cantidad,
                    fechaModificacion: new Date().toISOString()
                })
            );
        } else {
            // Crear un nuevo StockItem si no existe
            stockStore.add({
                id: Date.now(),
                nombre: producto,
                cantidad: cantidad,
                categoria: '',
                fechaCreacion: new Date().toISOString(),
                fechaModificacion: null
            });
        }

        producto = '';
        cantidad = 0;

        alert("Lote agregado y stock actualizado");
    }
</script>

<div class="card">
    <h2>Registrar lote producido</h2>

    <label>Producto</label>
    <input bind:value={producto} placeholder="Ej: Madera plástica tipo A" />

    <label>Cantidad producida</label>
    <input type="number" bind:value={cantidad} min="1" />

    <button on:click={agregarLote}>Guardar lote</button>
</div>

<style>
.card {
    padding: 1rem;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,.1);
}
button {
    padding: .5rem;
    background: #1e90ff;
    color: white;
    border-radius: 6px;
    border: none;
}
</style>
