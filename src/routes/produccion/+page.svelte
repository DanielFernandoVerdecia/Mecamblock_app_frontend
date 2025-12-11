<script lang="ts">
    import { onMount } from 'svelte';
    import { ProductionRecord } from '$lib/models/production';
    import type { StockItem } from '$lib/models/stock'; // Importamos solo el tipo para leer stock
    import {enrutador} from '../../routes/router_now'

    // --- ESTADO ---
    let produccion: ProductionRecord[] = [];
    let stock: StockItem[] = []; // Agregamos estado del stock
    let listaProductosStock: string[] = []; // Para llenar el Select desde Stock
    let cargado = false;

    // Variables de Formulario
    let fechaInput = new Date().toISOString().split('T')[0]; // Fecha de hoy por defecto YYYY-MM-DD
    let productoSeleccionado = '';
    let cantidadInput = 0;

    // Variables de Edición
    let modoEdicion = false;
    let idEdicion: number | null = null;
    let cantidadAnterior = 0; // Para restar la cantidad anterior en edición

    // Variables de Filtro/Visualización
    let fechaFiltro = new Date().toISOString().split('T')[0]; // Para ver producción por día

    // --- PERSISTENCIA Y CONEXIÓN CON STOCK ---
    onMount(() => {
        // 1. Cargar registros de producción (HU05 DB)
        const datosProd = localStorage.getItem('production_hu05_db');
        if (datosProd) {
            try { produccion = JSON.parse(datosProd); } 
            catch (e) { console.error("Error producción", e); }
        }

        // 2. Cargar lista de productos desde STOCK (HU04 DB) - RELACIÓN CLAVE
        const datosStock = localStorage.getItem('stock_hu04_db');
        if (datosStock) {
            try {
                stock = JSON.parse(datosStock);
                // Extraemos solo los nombres únicos para el dropdown
                listaProductosStock = [...new Set(stock.map(i => i.nombre))];
            } catch (e) { console.error("Error leyendo stock", e); }
        }

        cargado = true;
    });

    // Guardado automático
    $: if (cargado) {
        localStorage.setItem('production_hu05_db', JSON.stringify(produccion));
    }

    // Guardado automático del stock
    $: if (cargado) {
        localStorage.setItem('stock_hu04_db', JSON.stringify(stock));
    }

    // --- LÓGICA HU05 (Cálculos Automáticos) ---
    
    // Filtramos la tabla para mostrar lo del día seleccionado en el filtro
    $: registrosVisibles = produccion.filter(p => p.fechaProduccion === fechaFiltro);

    // Criterio 2: Calcular producción total automáticamente
    $: totalDia = registrosVisibles.reduce((sum, item) => sum + item.cantidad, 0);

    // --- UTILIDADES ---
    function formatearFechaHora(isoString: string | null) {
        if (!isoString) return '-';
        return new Date(isoString).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
    }

    function actualizarStock(nombreProducto: string, cantidad: number) {
        const productoIndex = stock.findIndex(item => item.nombre === nombreProducto);
        if (productoIndex !== -1) {
            stock[productoIndex].cantidad += cantidad;
            stock[productoIndex].fechaModificacion = new Date().toISOString();
        }
    }

    // --- ACCIONES ---

    function gestionarProduccion() {
        if (!productoSeleccionado || cantidadInput <= 0) {
            alert("Selecciona un producto válido y cantidad mayor a 0");
            return;
        }

        if (modoEdicion && idEdicion !== null) {
            // EDICIÓN (HU05 Criterio 3)
            const registroEditado = produccion.find(p => p.id === idEdicion);
            if (registroEditado) {
                // Si cambió la cantidad, ajustamos el stock
                const diferencia = cantidadInput - cantidadAnterior;
                if (registroEditado.productoNombre !== productoSeleccionado) {
                    // Si cambió el producto, restamos de uno y sumamos al otro
                    actualizarStock(registroEditado.productoNombre, -cantidadAnterior);
                    actualizarStock(productoSeleccionado, cantidadInput);
                } else {
                    // Si es el mismo producto, solo ajustamos la diferencia
                    actualizarStock(productoSeleccionado, diferencia);
                }
            }

            produccion = produccion.map(item => {
                if (item.id === idEdicion) {
                    return {
                        ...item,
                        productoNombre: productoSeleccionado,
                        cantidad: cantidadInput,
                        fechaProduccion: fechaInput, // Permite corregir la fecha
                        fechaModificacion: new Date().toISOString()
                    };
                }
                return item;
            });
            cancelarEdicion();
            alert("Se ha editado con éxito!!! El stock ha sido actualizado.");
        } else {
            // REGISTRO (HU05 Criterio 1)
            const nuevoRegistro = new ProductionRecord(productoSeleccionado, cantidadInput, fechaInput);
            produccion = [nuevoRegistro, ...produccion];
            
            // Actualizar stock automáticamente
            actualizarStock(productoSeleccionado, cantidadInput);
            
            // Limpieza parcial (mantenemos fecha y producto para agilizar digitación masiva)
            cantidadInput = 0; 

            alert("Se ha creado un registro con éxito! El stock se ha actualizado automáticamente.");
        }
    }

    function iniciarEdicion(item: ProductionRecord) {
        idEdicion = item.id;
        productoSeleccionado = item.productoNombre;
        cantidadInput = item.cantidad;
        cantidadAnterior = item.cantidad; // Guardar cantidad anterior para calcular diferencia
        fechaInput = item.fechaProduccion;
        modoEdicion = true;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function cancelarEdicion() {
        modoEdicion = false;
        idEdicion = null;
        cantidadInput = 0;
        cantidadAnterior = 0;
        fechaInput = new Date().toISOString().split('T')[0];
    }

    function eliminarRegistro(id: number) {
        if(confirm('¿Eliminar este registro de producción? El stock será ajustado.')) {
            const registroEliminar = produccion.find(p => p.id === id);
            if (registroEliminar) {
                // Restar la cantidad del stock cuando se elimina
                actualizarStock(registroEliminar.productoNombre, -registroEliminar.cantidad);
            }
            produccion = produccion.filter(p => p.id !== id);
        }
    }
</script>

<div class="container">
    <header>
        <h1>🏭 Registro de Producción</h1>
        <p class="subtitle">HU05: Consolidación de información diaria. (Stock se actualiza automáticamente)</p>
    </header>

    <section class="panel form-panel" class:editing-mode={modoEdicion}>
        <div class="form-header">
            <h3>{modoEdicion ? '📝 Corrigiendo Registro' : '🧱 Registrar Producción del Turno'}</h3>
            {#if modoEdicion}
                <button class="btn-link" on:click={cancelarEdicion}>Cancelar edición</button>
            {/if}
        </div>

        <div class="form-grid">
            <div class="input-group">
                <!-- svelte-ignore a11y_label_has_associated_control -->
                <label>Fecha Producción</label>
                <input type="date" bind:value={fechaInput} />
            </div>

            <div class="input-group big">
                <!-- svelte-ignore a11y_label_has_associated_control -->
                <label>Tipo de Producto (Del Inventario)</label>
                <select bind:value={productoSeleccionado}>
                    <option value="" disabled selected>-- Seleccionar --</option>
                    {#each listaProductosStock as nombreProd}
                        <option value={nombreProd}>{nombreProd}</option>
                    {:else}
                        <option value="" disabled>⚠️ No hay productos en Inventario</option>
                    {/each}
                </select>
            </div>

            <div class="input-group">
                <!-- svelte-ignore a11y_label_has_associated_control -->
                <label>Cantidad</label>
                <input type="number" min="1" placeholder="0" bind:value={cantidadInput} />
            </div>

            <div class="input-group btn-group">
                <button class={modoEdicion ? 'btn-update' : 'btn-save'} on:click={gestionarProduccion}>
                    {modoEdicion ? 'Corregir' : 'Registrar'}
                </button>
            </div>

           
    </section>

    <hr class="divider">

    <section class="panel report-panel">

        <h1>Informe!!!</h1>
        
        <div class="dashboard-bar">
            <div class="filter-area">
                <!-- svelte-ignore a11y_label_has_associated_control -->
                <label>📅 Ver producción del día:</label>
                <input type="date" bind:value={fechaFiltro} />
            </div>
            
            <div class="kpi-card">
                <span class="kpi-label">TOTAL PRODUCIDO</span>
                <span class="kpi-value">{totalDia} <small>unidades</small></span>
            </div>
        </div>

        <div class="table-responsive">
            <table>
                <thead>
                    <tr>
                        <th>Fecha Prod.</th>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Auditoría</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {#each registrosVisibles as item (item.id)}
                        <tr class:row-edit={item.id === idEdicion}>
                            <td>{item.fechaProduccion}</td>
                            
                            <td><strong>{item.productoNombre}</strong></td>
                            
                            <td class="qty-cell">+{item.cantidad}</td>
                            
                            <td class="audit-info">
                                <div>Creado: {formatearFechaHora(item.fechaRegistro)}</div>
                                {#if item.fechaModificacion}
                                    <div class="mod-alert">Editado: {formatearFechaHora(item.fechaModificacion)}</div>
                                {/if}
                            </td>
                            
                            <td class="actions">
                                <button class="btn-icon edit" on:click={() => iniciarEdicion(item)} title="Editar/Corregir">✏️</button>
                                <button class="btn-icon del" on:click={() => eliminarRegistro(item.id)} title="Eliminar">🗑️</button>
                            </td>
                        </tr>
                    {:else}
                        <tr>
                            <td colspan="5" class="empty-state">
                                No hay registros de producción para la fecha {fechaFiltro}.
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>

    </section>
</div>


<div style = "display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;">

  <button type="button" class="btn btn-secondary btn-lg"
  on:click = {()=> enrutador('/ruta_main')}
  >
    Volver al menú principal
  </button>

</div>

<style>
    /* Estilos Globales consistentes con la vista anterior */
    .container { max-width: 900px; margin: 20px auto; font-family: 'Segoe UI', sans-serif; color: #333; }
    header { margin-bottom: 20px; }
    h1 { margin: 0; color: #2c3e50; }
    .subtitle { color: #7f8c8d; margin: 5px 0 0 0; }

    /* Paneles */
    .panel { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); border: 1px solid #e0e0e0; margin-bottom: 20px; }
    
    /* Modo Edición */
    .editing-mode { background-color: #fff8e1; border-left: 5px solid #ffc107; border-color: #ffe082; }
    .form-header { display: flex; justify-content: space-between; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
    .btn-link { background: none; border: none; color: #666; text-decoration: underline; cursor: pointer; }

    /* Formulario Grid */
    .form-grid { display: flex; flex-wrap: wrap; gap: 15px; align-items: flex-end; }
    .input-group { display: flex; flex-direction: column; flex: 1; min-width: 120px; }
    .input-group.big { flex: 2; min-width: 200px; }
    .input-group.btn-group { flex: 0 0 auto; }

    label { font-size: 0.85rem; font-weight: 600; color: #555; margin-bottom: 5px; }
    input, select { padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem; }
    input:focus, select:focus { border-color: #3498db; outline: none; }

    /* Botones */
    button { cursor: pointer; font-weight: bold; border-radius: 4px; border: none; }
    .btn-save { background-color: #1c7399; color: white; padding: 11px 25px; }
    .btn-save:hover { background-color: #1c7399; }
    .btn-update { background-color: #f39c12; color: white; padding: 11px 25px; }

    .divider { border: 0; border-top: 1px solid #eee; margin: 30px 0; }

    /* Dashboard Bar (Criterio 2) */
    .dashboard-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; background: #f8f9fa; padding: 15px; border-radius: 8px; }
    .filter-area { display: flex; align-items: center; gap: 10px; }
    
    .kpi-card { text-align: right; }
    .kpi-label { display: block; font-size: 0.75rem; color: #7f8c8d; letter-spacing: 1px; font-weight: bold; }
    .kpi-value { font-size: 1.8rem; font-weight: bold; color: #2c3e50; }
    .kpi-value small { font-size: 0.9rem; font-weight: normal; color: #7f8c8d; }

    /* Tabla */
    .table-responsive { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; font-size: 0.95rem; }
    th { text-align: left; background: #ecf0f1; padding: 12px; color: #2c3e50; }
    td { padding: 12px; border-bottom: 1px solid #eee; vertical-align: middle; }
    
    .qty-cell { font-weight: bold; color: #1c7399; font-size: 1.1rem; }
    .audit-info { font-size: 0.75rem; color: #95a5a6; }
    .mod-alert { color: #e67e22; font-weight: bold; }
    
    .actions { display: flex; gap: 5px; }
    .btn-icon { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: white; border: 1px solid #ddd; }
    .btn-icon:hover { background-color: #f0f0f0; }
    .btn-icon.edit { color: #3498db; }
    .btn-icon.del { color: #c0392b; }
    
    .empty-state { text-align: center; padding: 30px; color: #bdc3c7; font-style: italic; }
    .row-edit { background-color: #fffde7; }
</style>