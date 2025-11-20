<script lang="ts">
    import { onMount } from 'svelte'; // Importación necesaria
    import { lotesStore } from '../../../stores/lotesStore';
    import { stockStore } from '../../../stores/stockStore';
    import { Lote } from '$lib/models/lote';
    import { get } from 'svelte/store';
    import { enrutador } from '../../../routes/router_now';
    import { StockItem } from '$lib/models/stock';

    let producto = '';
    let cantidad: number = 0;
    
    // Variable para almacenar la lista de productos cargada del localStorage
    let listaProductos: any[] = [];

    // Cargar productos al iniciar el componente
    onMount(() => {
        const datosStock = localStorage.getItem('stock_hu04_db');
        if (datosStock) {
            try {
                listaProductos = JSON.parse(datosStock);
            } catch (e) {
                console.error("Error cargando productos del inventario", e);
            }
        }
    });

    function agregarLote() {
        if (!producto || cantidad <= 0) {
            alert("Complete los campos correctamente");
            return;
        }

        // 1. Crear el lote
        const nuevoLote = new Lote(producto, cantidad);
        lotesStore.add(nuevoLote);

        // 2. Actualizar stock (Lógica original mantenida)
        // Nota: Asegúrate de que stockStore tenga los métodos .replace o .update definidos en tu custom store
        const stockActual = get(stockStore);
        const existente = stockActual.find(x => x.nombre === producto);

        if (existente) {
            stockStore.replace(
                s => s.id === existente.id,
                s => ({
                    ...s,
                    cantidad: s.cantidad + cantidad,
                    fechaModificacion: new Date().toISOString()
                })
            );
        } else {
            // Corrección sugerida: Usar el constructor de la clase StockItem
            // en lugar de StockItem.arguments si esa función no existe.
            const nuevoItem = new StockItem(producto, cantidad);
            // Asumimos que stockStore tiene un método .add o usamos update
            // stockStore.update(items => [...items, nuevoItem]); 
            
            // Mantengo tu lógica original si tu store personalizado la soporta:
            if (typeof stockStore.add === 'function') {
                 stockStore.add(nuevoItem);
            }
        }

        // Limpiar formulario
        producto = '';
        cantidad = 0;

        alert("Lote agregado y stock actualizado");
    }
</script>

<div class="card">
    <h2>Registrar lote producido</h2>

    <label>Producto</label>
    <select bind:value={producto}>
        <option value="" disabled selected>-- Seleccione un producto --</option>
        {#each listaProductos as item}
            <option value={item.nombre}>{item.nombre}</option>
        {:else}
            <option value="" disabled>No hay productos en el inventario</option>
        {/each}
    </select>

    <label>Cantidad producida</label>
    <input type="number" bind:value={cantidad} min="1" />

    <button onclick={agregarLote} class="btn btn-primary">Guardar lote</button>
    <button onclick={()=> enrutador('/defectos')} class="btn btn-secondary">Volver al formulario Defectos</button>

</div>

<style>
.card {
    padding: 1rem;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,.1);

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 1rem;
}

/* Estilo para que el select se vea bien */
select, input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%; /* O el ancho que prefieras */
    box-sizing: border-box;
}
</style>