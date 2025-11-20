<script lang="ts">
    import { onMount } from 'svelte';
    import { enrutador } from '../../../routes/router_now';

    // --- INTERFACES ---
    interface FormData {
        fecha: string;
        maquina: string;
        observaciones: string;
        repuestos: string;
        tecnico: string;
    }

    interface Registro extends FormData {
        id: number;
        fechaRegistro: string;
        fechaModificacion?: string; // Agregamos campo para auditoría de cambios
    }

    interface Errors {
        fecha?: string;
        maquina?: string;
        observaciones?: string;
        tecnico?: string;
    }

    // --- ESTADO ---
    let formData: FormData = {
        fecha: '',
        maquina: '',
        observaciones: '',
        repuestos: '',
        tecnico: ''
    };

    // Variables de Edición
    let editingId: number | null = null; // ID del registro que estamos editando

    let historial: Registro[] = [];
    let errors: Errors = {};
    let successMessage: string = '';
    
    // Paginación
    let currentPage: number = 1;
    const itemsPerPage: number = 5;

    // Listas maestras
    const maquinas: string[] = ['Torno CNC-01', 'Fresadora-02', 'Prensa Hidráulica-03', 'Soldadora-04', 'Compresor-05'];
    const tecnicos: string[] = ['Juan Pérez', 'María López', 'Carlos Ruiz', 'Ana García', 'Roberto Sánchez'];

    // --- CICLO DE VIDA ---
    onMount((): void => {
        cargarHistorial();
    });

    // --- LÓGICA DE DATOS ---
    function cargarHistorial(): void {
        const datos = localStorage.getItem('maintenanceHistory');
        if (datos) {
            try {
                historial = JSON.parse(datos) as Registro[];
            } catch (e) {
                console.error("Error leyendo historial", e);
            }
        }
    }

    function guardarHistorial(): void {
        localStorage.setItem('maintenanceHistory', JSON.stringify(historial));
    }

    function validarFormulario(): boolean {
        errors = {};
        if (!formData.fecha) errors.fecha = 'La fecha es requerida';
        if (!formData.maquina) errors.maquina = 'Debe seleccionar una máquina';
        if (!formData.observaciones || formData.observaciones.trim().length === 0)
            errors.observaciones = 'Las observaciones son requeridas';
        if (!formData.tecnico) errors.tecnico = 'El técnico es requerido';
        return Object.keys(errors).length === 0;
    }

    // --- LÓGICA PRINCIPAL (CREAR / EDITAR) ---
    function handleSubmit(): void {
        if (!validarFormulario()) return;

        if (editingId !== null) {
            // === MODO EDICIÓN ===
            historial = historial.map(item => {
                if (item.id === editingId) {
                    return {
                        ...item,           // Mantiene ID y fechaRegistro originales
                        ...formData,       // Sobrescribe con los nuevos datos del formulario
                        repuestos: formData.repuestos || 'N/A',
                        fechaModificacion: new Date().toLocaleString('es-CO') // Marca de tiempo de edición
                    };
                }
                return item;
            });
            
            successMessage = '✓ Registro actualizado exitosamente';
            cancelarEdicion();

        } else {
            // === MODO CREACIÓN ===
            const nuevoRegistro: Registro = {
                id: Date.now(),
                ...formData,
                repuestos: formData.repuestos || 'N/A',
                fechaRegistro: new Date().toLocaleString('es-CO')
            };

            historial = [nuevoRegistro, ...historial];
            successMessage = '✓ Registro guardado exitosamente';
            limpiarFormulario();
        }

        guardarHistorial();
        
        // Feedback visual temporal
        setTimeout((): void => {
            successMessage = '';
        }, 3000);
    }

    // --- FUNCIONES DE EDICIÓN ---
    function cargarParaEditar(registro: Registro): void {
        // Rellenamos el formulario con los datos del registro
        formData = {
            fecha: registro.fecha,
            maquina: registro.maquina,
            observaciones: registro.observaciones,
            repuestos: registro.repuestos,
            tecnico: registro.tecnico
        };
        editingId = registro.id;
        
        // Scroll suave hacia el formulario
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function cancelarEdicion(): void {
        editingId = null;
        limpiarFormulario();
    }

    function limpiarFormulario(): void {
        formData = {
            fecha: '',
            maquina: '',
            observaciones: '',
            repuestos: '',
            tecnico: ''
        };
        errors = {};
    }

    function eliminarRegistro(id: number): void {
        if (confirm('¿Está seguro de que desea eliminar este registro?')) {
            historial = historial.filter((item): boolean => item.id !== id);
            guardarHistorial();
            // Si eliminamos el que estamos editando, cancelamos la edición
            if (editingId === id) cancelarEdicion();
        }
    }

    // --- PAGINACIÓN ---
    $: paginatedData = historial.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    $: totalPages = Math.ceil(historial.length / itemsPerPage);

    function nextPage(): void { if (currentPage < totalPages) currentPage++; }
    function prevPage(): void { if (currentPage > 1) currentPage--; }

</script>

<div class="maintenance-container">

    <h1 style="text-align: center; margin-top: 2rem;">HU03 - Gestión de Mantenimiento</h1>

    {#if successMessage}
        <div class="success-message">
            {successMessage}
        </div>
    {/if}

    <!-- FORMULARIO -->
    <div class="form-section" class:editing-mode={editingId !== null}>
        <div class="form-header">
            <h2>{editingId !== null ? '✏️ Editando Intervención' : '📝 Registrar Intervención'}</h2>
            {#if editingId !== null}
                <button type="button" class="btn-cancel-link" on:click={cancelarEdicion}>Cancelar edición</button>
            {/if}
        </div>
        
        <form on:submit|preventDefault={handleSubmit}>
            <div class="form-row">
                <div class="form-group">
                    <label for="fecha">Fecha de Intervención *</label>
                    <input
                        id="fecha"
                        type="date"
                        bind:value={formData.fecha}
                        class:error={errors.fecha}
                    />
                    {#if errors.fecha}<span class="error-text">{errors.fecha}</span>{/if}
                </div>

                <div class="form-group">
                    <label for="maquina">Máquina *</label>
                    <select id="maquina" bind:value={formData.maquina} class:error={errors.maquina}>
                        <option value="">-- Seleccionar máquina --</option>
                        {#each maquinas as maq}
                            <option value={maq}>{maq}</option>
                        {/each}
                    </select>
                    {#if errors.maquina}<span class="error-text">{errors.maquina}</span>{/if}
                </div>

                <div class="form-group">
                    <label for="tecnico">Técnico Responsable *</label>
                    <select id="tecnico" bind:value={formData.tecnico} class:error={errors.tecnico}>
                        <option value="">-- Seleccionar técnico --</option>
                        {#each tecnicos as tech}
                            <option value={tech}>{tech}</option>
                        {/each}
                    </select>
                    {#if errors.tecnico}<span class="error-text">{errors.tecnico}</span>{/if}
                </div>
            </div>

            <div class="form-row">
                <div class="form-group full-width">
                    <label for="observaciones">Observaciones *</label>
                    <textarea
                        id="observaciones"
                        bind:value={formData.observaciones}
                        placeholder="Describa el estado de la máquina y acciones realizadas"
                        rows="4"
                        class:error={errors.observaciones}
                    ></textarea>
                    {#if errors.observaciones}<span class="error-text">{errors.observaciones}</span>{/if}
                </div>
            </div>

            <div class="form-row">
                <div class="form-group full-width">
                    <label for="repuestos">Repuestos Utilizados</label>
                    <input
                        id="repuestos"
                        type="text"
                        bind:value={formData.repuestos}
                        placeholder="Ej: Rodamientos, correas, aceite ISO 46 (opcional)"
                    />
                </div>
            </div>

            <div class="button-group">
                <button type="submit" class="btn-primary" class:btn-warning={editingId !== null}>
                    {editingId !== null ? 'Actualizar Registro' : 'Guardar Registro'}
                </button>
                
                {#if editingId !== null}
                    <button type="button" class="btn-secondary" on:click={cancelarEdicion}>
                        Cancelar
                    </button>
                {/if}
            </div>
        </form>
    </div>

    <!-- HISTORIAL -->
    <div class="history-section">
        <h2>Historial de Intervenciones ({historial.length})</h2>

        {#if historial.length === 0}
            <div class="empty-state">
                <p>No hay registros de mantenimiento. ¡Crea uno nuevo!</p>
            </div>
        {:else}
            <div class="table-responsive">
                <table class="history-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Máquina</th>
                            <th>Técnico</th>
                            <th>Observaciones</th>
                            <th>Repuestos</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each paginatedData as registro (registro.id)}
                            <tr class:row-selected={registro.id === editingId}>
                                <td>{new Date(registro.fecha).toLocaleDateString('es-CO')}</td>
                                <td><span class="badge">{registro.maquina}</span></td>
                                <td>{registro.tecnico}</td>
                                <td class="obs-cell">{registro.observaciones}</td>
                                <td class="repuestos-cell">{registro.repuestos}</td>
                                <td class="actions-cell">
                                    <!-- BOTÓN EDITAR -->
                                    <button 
                                        class="btn-icon edit" 
                                        on:click={() => cargarParaEditar(registro)} 
                                        title="Editar"
                                    >
                                        ✏️
                                    </button>
                                    <!-- BOTÓN ELIMINAR -->
                                    <button
                                        class="btn-icon delete"
                                        on:click={() => eliminarRegistro(registro.id)}
                                        title="Eliminar"
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>

            <!-- PAGINACIÓN -->
            {#if totalPages > 1}
                <div class="pagination">
                    <button on:click={prevPage} disabled={currentPage === 1} class="btn-nav">← Anterior</button>
                    <span class="page-info">Página {currentPage} de {totalPages}</span>
                    <button on:click={nextPage} disabled={currentPage === totalPages} class="btn-nav">Siguiente →</button>
                </div>
            {/if}
        {/if}
    </div>
</div>

<div class="footer-actions">
    <button type="button" class="btn-back btn-lg" on:click={() => enrutador('/ruta_main')}>
        Volver al menú principal
    </button>
</div>

<style>
    /* Estilos generales */
    .maintenance-container {
        max-width: 1200px; margin: 0 auto; padding: 20px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        display: flex; flex-direction: column; gap: 1rem;
    }

    h1 { color: #2c3e50; margin-bottom: 30px; font-size: 28px; }
    h2 { color: #34495e; margin-bottom: 0; font-size: 20px; }

    /* Mensajes */
    .success-message {
        background-color: #d4edda; color: #155724; padding: 12px 16px;
        border-radius: 4px; border-left: 4px solid #28a745;
        animation: slideIn 0.3s ease-in;
    }

    /* Formulario y Modos */
    .form-section {
        background: #f8f9fa; padding: 25px; border-radius: 8px;
        margin-bottom: 30px; border: 1px solid #e0e0e0;
        transition: all 0.3s ease;
    }
    
    /* Estilo especial cuando se edita */
    .editing-mode {
        background-color: #fffbf0;
        border-left: 5px solid #f39c12;
        border-color: #ffe082;
    }

    .form-header {
        display: flex; justify-content: space-between; align-items: center;
        border-bottom: 2px solid #ddd; padding-bottom: 10px; margin-bottom: 20px;
    }
    .editing-mode .form-header { border-bottom-color: #f39c12; }

    .form-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-bottom: 15px; }
    .form-group { display: flex; flex-direction: column; }
    .form-group.full-width { grid-column: 1 / -1; }

    label { font-weight: 600; margin-bottom: 6px; color: #2c3e50; font-size: 14px; }
    input, select, textarea {
        padding: 10px 12px; border: 1px solid #bdc3c7; border-radius: 4px;
        font-size: 14px; font-family: inherit;
    }
    input:focus, select:focus, textarea:focus {
        outline: none; border-color: #3498db; box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
    }
    .error { border-color: #e74c3c; background-color: #fadbd8; }
    .error-text { color: #e74c3c; font-size: 12px; margin-top: 4px; }

    /* Botones */
    .button-group { display: flex; gap: 10px; margin-top: 10px; }
    
    .btn-primary {
        background-color: #27ae60; color: white; padding: 12px 30px;
        border: none; border-radius: 4px; font-weight: 600; cursor: pointer;
        transition: background 0.2s; flex: 1;
    }
    .btn-primary:hover { background-color: #229954; }
    
    .btn-warning { background-color: #f39c12; color: white; }
    .btn-warning:hover { background-color: #e67e22; }

    .btn-secondary {
        background-color: #95a5a6; color: white; padding: 12px 20px;
        border: none; border-radius: 4px; cursor: pointer; font-weight: 600;
    }
    .btn-cancel-link {
        background: none; border: none; color: #c0392b; 
        text-decoration: underline; cursor: pointer; font-size: 14px;
    }

    /* Tabla */
    .history-section { background: #ffffff; padding: 25px; border-radius: 8px; border: 1px solid #e0e0e0; }
    .history-table { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 15px; }
    .history-table thead { background-color: #34495e; color: white; }
    .history-table th, .history-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ecf0f1; }
    
    .row-selected { background-color: #fff3cd !important; } /* Resaltar fila editada */
    
    .badge { background-color: #3498db; color: white; padding: 4px 8px; border-radius: 3px; font-weight: 600; }
    .obs-cell { max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    /* Acciones de Tabla */
    .actions-cell { display: flex; gap: 8px; }
    .btn-icon { 
        background: white; border: 1px solid #ddd; cursor: pointer; 
        padding: 5px 8px; border-radius: 4px; font-size: 16px; transition: 0.2s;
    }
    .btn-icon.edit:hover { background-color: #d6eaf8; border-color: #3498db; }
    .btn-icon.delete:hover { background-color: #fadbd8; border-color: #e74c3c; }

    /* Paginación */
    .pagination { display: flex; justify-content: center; gap: 15px; margin-top: 20px; align-items: center; }
    .btn-nav { background-color: #3498db; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
    .btn-nav:disabled { background-color: #bdc3c7; cursor: not-allowed; }

    /* Footer */
    .footer-actions { display: flex; justify-content: center; padding: 20px; }
    .btn-back { background-color: #6c757d; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; }

    @keyframes slideIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
</style>