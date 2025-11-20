<script lang="ts">
    import { onMount } from 'svelte';
    import { lotesStore } from '../../../stores/lotesStore';
    import { stockStore } from '../../../stores/stockStore';
    import { Lote } from '$lib/models/lote';
    import { get } from 'svelte/store';
    import { enrutador } from '../../../routes/router_now';
    import { StockItem } from '$lib/models/stock';
    import { inspectionsStore, averagePercentageByProduct } from '../../../stores/inspectionsStore';

    // --- FUNCIONES DE AYUDA (INSPECCIONES) ---
    function pct(i:any) {
        if (!i.inspeccionado) return 0;
        return ((i.defectuoso / i.inspeccionado) * 100).toFixed(2);
    }

    function avgForProduct(producto: string) {
        return averagePercentageByProduct(producto).toFixed(2);
    }

    // --- VARIABLES DEL FORMULARIO ---
    let producto = '';
    let cantidad: number = 0;

    // --- VARIABLES PARA EDICIÓN ---
    let modoEdicion = false;
    let idEdicion: number | null = null;
    let cantidadOriginal: number = 0;   // Para ajustar el stock correctamente
    let productoOriginal: string = '';  // Por si cambian el producto al editar

    // --- DATOS EXTERNOS ---
    let listaProductos: any[] = [];

    onMount(() => {
        const datosStock = localStorage.getItem('stock_hu04_db');
        if (datosStock) {
            try {
                listaProductos = JSON.parse(datosStock);
            } catch (e) {
                console.error("Error cargando productos", e);
            }
        }
    });

    // --- LÓGICA PRINCIPAL ---

    function gestionarLote() {
        if (!producto || cantidad <= 0) {
            alert("Complete los campos correctamente");
            return;
        }

        if (modoEdicion && idEdicion !== null) {
            // === MODO EDICIÓN ===
            
            // 1. Actualizar el Lote en el Store
            lotesStore.update(items => items.map(l => {
                if (l.id === idEdicion) {
                    return { ...l, producto, cantidad, fechaModificacion: new Date().toISOString() };
                }
                return l;
            }));

            // 2. Ajustar el Stock (Inventario)
            // Primero: Revertimos la cantidad original del producto original
            actualizarStock(productoOriginal, -cantidadOriginal);
            // Segundo: Agregamos la nueva cantidad al producto seleccionado
            actualizarStock(producto, cantidad);

            alert("Lote actualizado correctamente");
            cancelarEdicion();

        } else {
            // === MODO CREACIÓN (Tu lógica original mejorada) ===
            
            const nuevoLote = new Lote(producto, cantidad);
            lotesStore.add(nuevoLote);

            // Sumar al stock
            actualizarStock(producto, cantidad);
            
            alert("Lote registrado exitosamente");
            limpiarFormulario();
        }
    }

    // Función auxiliar para manejar el stock
    function actualizarStock(nombreProd: string, cantidadDelta: number) {
        const stockActual = get(stockStore);
        const existente = stockActual.find(x => x.nombre === nombreProd);

        if (existente) {
            stockStore.replace(
                s => s.id === existente.id,
                s => ({
                    ...s,
                    cantidad: s.cantidad + cantidadDelta,
                    fechaModificacion: new Date().toISOString()
                })
            );
        } else if (cantidadDelta > 0) {
            // Solo creamos si estamos sumando (no tiene sentido crear para restar)
            if(typeof stockStore.add === 'function'){
                stockStore.add(new StockItem(nombreProd, cantidadDelta));
            }
        }
    }

    // --- FUNCIONES DE UI ---

    function iniciarEdicion(lote: any) {
        producto = lote.producto;
        cantidad = lote.cantidad;
        
        // Guardamos valores originales para el cálculo de stock
        productoOriginal = lote.producto;
        cantidadOriginal = lote.cantidad;
        
        idEdicion = lote.id;
        modoEdicion = true;

        // Scroll arriba para ver el formulario
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function cancelarEdicion() {
        modoEdicion = false;
        idEdicion = null;
        cantidadOriginal = 0;
        productoOriginal = '';
        limpiarFormulario();
    }

    function limpiarFormulario() {
        producto = '';
        cantidad = 0;
    }

    function eliminarLote(id: number, prod: string, cant: number) {
        if (confirm('¿Eliminar este lote? Se revertirá el stock.')) {
            // 1. Borrar lote
            lotesStore.update(lotes => lotes.filter(l => l.id !== id));
            
            // 2. Devolver stock (Restar lo que se había producido)
            actualizarStock(prod, -cant);
            
            // Si estábamos editando ese mismo, cancelar
            if (idEdicion === id) cancelarEdicion();
        }
    }
    
    function formatearFecha(iso: string) {
        return new Date(iso).toLocaleString();
    }
</script>

<div class="container">
    
    <div class="card" class:editing={modoEdicion}>
        <h2>
            {modoEdicion ? '✏️ Editar Lote' : '➕ Registrar Lote Producido'}
        </h2>

        <label>Producto</label>
        <select bind:value={producto}>
            <option value="" disabled selected>-- Seleccione un producto --</option>
            {#each listaProductos as item}
                <option value={item.nombre}>{item.nombre}</option>
            {:else}
                <option value="" disabled>No hay productos en inventario</option>
            {/each}
        </select>

        <label>Cantidad producida</label>
        <input type="number" bind:value={cantidad} min="1" placeholder="0" />

        <div class="actions">
            <button onclick={gestionarLote} class="btn" class:btn-update={modoEdicion} class:btn-primary={!modoEdicion}>
                {modoEdicion ? 'Actualizar Lote' : 'Guardar Lote'}
            </button>

            {#if modoEdicion}
                <button onclick={cancelarEdicion} class="btn btn-secondary">Cancelar</button>
            {/if}
            
            {#if !modoEdicion}
                 <button onclick={()=> enrutador('/defectos')} class="btn btn-secondary">Volver</button>
            {/if}
        </div>
    </div>

    <div class="card list-card">
        <h3>📋 Lotes Activos</h3>
        
        {#if $lotesStore.length === 0}
            <p class="empty-msg">No hay lotes registrados aún.</p>
        {:else}
            <table class="lotes-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Producto</th>
                        <th>Cant.</th>
                        <th>Fecha</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {#each $lotesStore as lote (lote.id)}
                        <tr class:selected-row={lote.id === idEdicion}>
                            <td><small>#{lote.id.toString().slice(-4)}</small></td>
                            <td><strong>{lote.producto}</strong></td>
                            <td>{lote.cantidad}</td>
                            <td><small>{formatearFecha(lote.fechaCreacion)}</small></td>
                            <td class="action-cell">
                                <button class="btn-icon edit" onclick={() => iniciarEdicion(lote)} title="Editar">
                                    ✏️
                                </button>
                                <button class="btn-icon delete" onclick={() => eliminarLote(lote.id, lote.producto, lote.cantidad)} title="Eliminar">
                                    🗑️
                                </button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        {/if}
    </div>

    <div class="card">
        <h3>Inspecciones</h3>
        {#if $inspectionsStore.length === 0}
            <p class="empty-msg">No hay inspecciones registradas.</p>
        {/if}

        <ul>
            {#each $inspectionsStore as i}
            <li>
                <strong>Lote:</strong> {i.loteId} — <strong>Producto:</strong> {i.producto} — <strong>%:</strong> {pct(i)}%
                <div style="font-size:.85rem; color:#666">Fecha: {new Date(i.fecha).toLocaleString()}</div>
                <div style="font-size:.85rem; color:#666">Promedio histórico producto: {avgForProduct(i.producto)}%</div>
            </li>
            {/each}
        </ul>
    </div>

</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        gap: 20px;
        max-width: 600px;
        margin: 0 auto;
    }

    .card {
        padding: 1.5rem;
        background: white;
        border-radius: 10px;
        box-shadow: 0 2px 8px rgba(0,0,0,.1);
        display: flex;
        flex-direction: column;
        gap: 1rem;
        transition: all 0.3s ease;
    }

    /* Estilo visual cuando se está editando */
    .card.editing {
        border: 2px solid #ffc107;
        background-color: #fffbf0;
    }

    h2, h3 { margin-top: 0; color: #333; }

    label { font-weight: bold; font-size: 0.9rem; color: #555; }

    select, input {
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-size: 1rem;
    }

    .actions { display: flex; gap: 10px; flex-wrap: wrap; }

    .btn { padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; flex: 1; }
    .btn-primary { background-color: #007bff; color: white; }
    .btn-primary:hover { background-color: #0056b3; }
    
    .btn-update { background-color: #ffc107; color: #333; }
    .btn-update:hover { background-color: #e0a800; }

    .btn-secondary { background-color: #6c757d; color: white; }

    /* Estilos de la Tabla */
    .lotes-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    .lotes-table th { text-align: left; background: #f8f9fa; padding: 8px; border-bottom: 2px solid #eee; font-size: 0.85rem; }
    .lotes-table td { padding: 8px; border-bottom: 1px solid #eee; font-size: 0.9rem; vertical-align: middle; }
    
    /* Fila seleccionada en edición */
    .selected-row { background-color: #fff3cd; font-weight: bold; }

    .action-cell { display: flex; gap: 5px; }

    .btn-icon { background: white; border: 1px solid #ddd; cursor: pointer; font-size: 1.1rem; padding: 4px 8px; border-radius: 4px; }
    .btn-icon.edit:hover { background-color: #e3f2fd; border-color: #2196f3; }
    .btn-icon.delete:hover { background-color: #ffebee; border-color: #f44336; }

    .empty-msg { text-align: center; color: #999; font-style: italic; }
    
    ul { padding-left: 20px; }
    li { margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
</style>