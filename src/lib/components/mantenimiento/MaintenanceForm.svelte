//Al parecer funciona pero todo esta hardcodeado, falta conectar la información
<script lang="ts">
	import { onMount } from 'svelte';

	interface FormData {
		fecha: string;
		maquina: string;
		observaciones: string;
		repuestos: string;
		tecnico: string;
	}

	interface Registro extends FormData {
		id: number;
		repuestos: string;
		fechaRegistro: string;
	}

	interface Errors {
		fecha?: string;
		maquina?: string;
		observaciones?: string;
		tecnico?: string;
	}

	let formData: FormData = {
		fecha: '',
		maquina: '',
		observaciones: '',
		repuestos: '',
		tecnico: ''
	};

	let historial: Registro[] = [];
	let errors: Errors = {};
	let successMessage: string = '';
	let currentPage: number = 1;
	const itemsPerPage: number = 5;

	const maquinas: string[] = ['Torno CNC-01', 'Fresadora-02', 'Prensa Hidráulica-03', 'Soldadora-04', 'Compresor-05'];
	const tecnicos: string[] = ['Juan Pérez', 'María López', 'Carlos Ruiz', 'Ana García', 'Roberto Sánchez'];

	onMount((): void => {
		cargarHistorial();
	});

	function cargarHistorial(): void {
		const datos = localStorage.getItem('maintenanceHistory');
		if (datos) {
			historial = JSON.parse(datos) as Registro[];
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

	function handleSubmit(): void {
		if (!validarFormulario()) return;

		const nuevoRegistro: Registro = {
			id: Date.now(),
			...formData,
			repuestos: formData.repuestos || 'N/A',
			fechaRegistro: new Date().toLocaleString('es-CO')
		};

		historial = [nuevoRegistro, ...historial];
		guardarHistorial();
		successMessage = '✓ Registro guardado exitosamente';
		
		setTimeout((): void => {
			successMessage = '';
		}, 3000);

		// Limpiar formulario
		formData = {
			fecha: '',
			maquina: '',
			observaciones: '',
			repuestos: '',
			tecnico: ''
		};
	}

	function eliminarRegistro(id: number): void {
		if (confirm('¿Está seguro de que desea eliminar este registro?')) {
			historial = historial.filter((item): boolean => item.id !== id);
			guardarHistorial();
		}
	}

	// Paginación
	$: paginatedData = historial.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);
	$: totalPages = Math.ceil(historial.length / itemsPerPage);

	function nextPage(): void {
		if (currentPage < totalPages) currentPage++;
	}

	function prevPage(): void {
		if (currentPage > 1) currentPage--;
	}
</script>

<div class="maintenance-container">
	<h1>Gestión de Mantenimiento</h1>

	{#if successMessage}
		<div class="success-message">
			{successMessage}
		</div>
	{/if}

	<!-- FORMULARIO -->
	<div class="form-section">
		<h2>Registrar Intervención</h2>
		
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
					{#if errors.fecha}
						<span class="error-text">{errors.fecha}</span>
					{/if}
				</div>

				<div class="form-group">
					<label for="maquina">Máquina *</label>
					<select
						id="maquina"
						bind:value={formData.maquina}
						class:error={errors.maquina}
					>
						<option value="">-- Seleccionar máquina --</option>
						{#each maquinas as maq}
							<option value={maq}>{maq}</option>
						{/each}
					</select>
					{#if errors.maquina}
						<span class="error-text">{errors.maquina}</span>
					{/if}
				</div>

				<div class="form-group">
					<label for="tecnico">Técnico Responsable *</label>
					<select
						id="tecnico"
						bind:value={formData.tecnico}
						class:error={errors.tecnico}
					>
						<option value="">-- Seleccionar técnico --</option>
						{#each tecnicos as tech}
							<option value={tech}>{tech}</option>
						{/each}
					</select>
					{#if errors.tecnico}
						<span class="error-text">{errors.tecnico}</span>
					{/if}
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
					{#if errors.observaciones}
						<span class="error-text">{errors.observaciones}</span>
					{/if}
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

			<button type="submit" class="btn-primary">Guardar Registro</button>
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
							<tr>
								<td>{new Date(registro.fecha).toLocaleDateString('es-CO')}</td>
								<td><span class="badge">{registro.maquina}</span></td>
								<td>{registro.tecnico}</td>
								<td class="obs-cell">{registro.observaciones}</td>
								<td class="repuestos-cell">{registro.repuestos}</td>
								<td>
									<button
										class="btn-delete"
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
					<button on:click={prevPage} disabled={currentPage === 1} class="btn-nav">
						← Anterior
					</button>
					<span class="page-info">
						Página {currentPage} de {totalPages}
					</span>
					<button on:click={nextPage} disabled={currentPage === totalPages} class="btn-nav">
						Siguiente →
					</button>
				</div>
			{/if}
		{/if}
	</div>
</div>

<style>
	.maintenance-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 20px;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}

	h1 {
		color: #2c3e50;
		margin-bottom: 30px;
		font-size: 28px;
	}

	h2 {
		color: #34495e;
		margin-bottom: 20px;
		font-size: 20px;
		border-bottom: 2px solid #3498db;
		padding-bottom: 10px;
	}

	/* MENSAJES */
	.success-message {
		background-color: #d4edda;
		color: #155724;
		padding: 12px 16px;
		border-radius: 4px;
		margin-bottom: 20px;
		border-left: 4px solid #28a745;
		animation: slideIn 0.3s ease-in;
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* FORMULARIO */
	.form-section {
		background: #f8f9fa;
		padding: 25px;
		border-radius: 8px;
		margin-bottom: 30px;
		border: 1px solid #e0e0e0;
	}

	.form-row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 15px;
		margin-bottom: 15px;
	}

	.form-group {
		display: flex;
		flex-direction: column;
	}

	.form-group.full-width {
		grid-column: 1 / -1;
	}

	label {
		font-weight: 600;
		margin-bottom: 6px;
		color: #2c3e50;
		font-size: 14px;
	}

	input,
	select,
	textarea {
		padding: 10px 12px;
		border: 1px solid #bdc3c7;
		border-radius: 4px;
		font-size: 14px;
		font-family: inherit;
		transition: border-color 0.3s, box-shadow 0.3s;
	}

	input:focus,
	select:focus,
	textarea:focus {
		outline: none;
		border-color: #3498db;
		box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
	}

	input.error,
	select.error,
	textarea.error {
		border-color: #e74c3c;
		background-color: #fadbd8;
	}

	textarea {
		resize: vertical;
		min-height: 80px;
	}

	.error-text {
		color: #e74c3c;
		font-size: 12px;
		margin-top: 4px;
	}

	.btn-primary {
		background-color: #27ae60;
		color: white;
		padding: 12px 30px;
		border: none;
		border-radius: 4px;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.3s;
		grid-column: 1 / -1;
	}

	.btn-primary:hover {
		background-color: #229954;
	}

	/* HISTORIAL */
	.history-section {
		background: #ffffff;
		padding: 25px;
		border-radius: 8px;
		border: 1px solid #e0e0e0;
	}

	.empty-state {
		text-align: center;
		padding: 40px 20px;
		color: #7f8c8d;
	}

	.table-responsive {
		overflow-x: auto;
		margin-bottom: 20px;
	}

	.history-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 13px;
	}

	.history-table thead {
		background-color: #34495e;
		color: white;
	}

	.history-table th {
		padding: 12px;
		text-align: left;
		font-weight: 600;
	}

	.history-table td {
		padding: 12px;
		border-bottom: 1px solid #ecf0f1;
	}

	.history-table tbody tr:hover {
		background-color: #f8f9fa;
	}

	.badge {
		background-color: #3498db;
		color: white;
		padding: 4px 8px;
		border-radius: 3px;
		font-size: 12px;
		font-weight: 600;
	}

	.obs-cell {
		max-width: 250px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.repuestos-cell {
		color: #7f8c8d;
		font-size: 12px;
	}

	.btn-delete {
		background: none;
		border: none;
		font-size: 18px;
		cursor: pointer;
		padding: 4px 8px;
		transition: transform 0.2s;
	}

	.btn-delete:hover {
		transform: scale(1.2);
	}

	/* PAGINACIÓN */
	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 15px;
		margin-top: 20px;
		padding-top: 20px;
		border-top: 1px solid #ecf0f1;
	}

	.btn-nav {
		background-color: #3498db;
		color: white;
		padding: 8px 16px;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 13px;
		font-weight: 600;
		transition: background-color 0.3s;
	}

	.btn-nav:hover:not(:disabled) {
		background-color: #2980b9;
	}

	.btn-nav:disabled {
		background-color: #bdc3c7;
		cursor: not-allowed;
	}

	.page-info {
		color: #7f8c8d;
		font-size: 13px;
		font-weight: 600;
	}

	@media (max-width: 768px) {
		.maintenance-container {
			padding: 10px;
		}

		.form-row {
			grid-template-columns: 1fr;
		}

		.table-responsive {
			font-size: 12px;
		}

		.history-table th,
		.history-table td {
			padding: 8px;
		}

		h1 {
			font-size: 22px;
		}

		h2 {
			font-size: 16px;
		}
	}
</style>
