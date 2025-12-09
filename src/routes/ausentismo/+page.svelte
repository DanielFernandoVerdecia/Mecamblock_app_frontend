<script lang="ts">
  import ModalConfirm from '$lib/components/ModalConfirm.svelte';
  import SearchFilter from '$lib/components/SearchFilter.svelte';
  import { enrutador } from '../../routes/router_now';

  // Tipos
  interface Ausentismo {
    id: number;
    operario: string;
    horasTrabajadas: number;
    observaciones: string;
    causaMayorFuerza: string;
    fechaCreacion: string;
    fechaModificacion?: string;
  }

  // Estado del formulario
  let operario = $state('');
  let horasTrabajadas = $state<number | null>(null);
  let observaciones = $state('');
  let causaMayorFuerza = $state('');
  let editingId = $state<number | null>(null);
  let errors = $state<string[]>([]);

  // Datos
  let list = $state<Ausentismo[]>([]);
  let q = $state('');

  // Modal
  let showModal = $state(false);
  let idToDelete = $state<number | null>(null);

  // Causas predefinidas
  const causasOptions = [
    'Enfermedad',
    'Accidente laboral',
    'Calamidad doméstica',
    'Licencia',
    'Otro'
  ];

  // LocalStorage
  const STORAGE_KEY = 'ausentismo_list';

  function loadFromStorage() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          list = JSON.parse(stored);
        } catch (e) {
          console.error('Error al cargar datos:', e);
          list = [];
        }
      }
    }
  }

  function saveToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }
  }

  loadFromStorage();

  // Validación
  function validate(): boolean {
    errors = [];
    const op = operario.trim();
    
    if (!op) errors.push('Operario es requerido');
    if (op.length > 100) errors.push('Operario demasiado largo');
    if (horasTrabajadas === null || horasTrabajadas < 0 || horasTrabajadas > 24) {
      errors.push('Horas trabajadas debe estar entre 0 y 24');
    }
    if (observaciones.length > 500) errors.push('Observaciones demasiado largas');
    if (!causaMayorFuerza) errors.push('Causa de fuerza mayor es requerida');

    return errors.length === 0;
  }

  // Agregar
  function add() {
    if (!validate()) return;

    const newItem: Ausentismo = {
      id: Date.now(),
      operario: operario.trim(),
      horasTrabajadas: horasTrabajadas!,
      observaciones: observaciones.trim(),
      causaMayorFuerza,
      fechaCreacion: new Date().toISOString()
    };

    list = [...list, newItem];
    saveToStorage();
    resetForm();
  }

  // Editar
  function startEdit(item: Ausentismo) {
    editingId = item.id;
    operario = item.operario;
    horasTrabajadas = item.horasTrabajadas;
    observaciones = item.observaciones;
    causaMayorFuerza = item.causaMayorFuerza;
  }

  function saveEdit() {
    if (editingId === null || !validate()) return;

    list = list.map(x =>
      x.id === editingId
        ? {
            ...x,
            operario: operario.trim(),
            horasTrabajadas: horasTrabajadas!,
            observaciones: observaciones.trim(),
            causaMayorFuerza,
            fechaModificacion: new Date().toISOString()
          }
        : x
    );

    saveToStorage();
    editingId = null;
    resetForm();
  }

  // Eliminar
  function askDelete(id: number) {
    idToDelete = id;
    showModal = true;
  }

  function confirmDelete() {
    if (idToDelete !== null) {
      list = list.filter(x => x.id !== idToDelete);
      saveToStorage();
    }
    showModal = false;
    idToDelete = null;
  }

  function cancelDelete() {
    showModal = false;
    idToDelete = null;
  }

  // Reset
  function resetForm() {
    operario = '';
    horasTrabajadas = null;
    observaciones = '';
    causaMayorFuerza = '';
    errors = [];
  }

  function cancelEdit() {
    editingId = null;
    resetForm();
  }

  // Filter
  function onFilter(e: CustomEvent) {
    q = e.detail.value;
  }

  let filtered = $derived.by(() => {
    return list.filter(
      it =>
        !q ||
        it.operario.toLowerCase().includes(q.toLowerCase()) ||
        it.causaMayorFuerza.toLowerCase().includes(q.toLowerCase())
    );
  });

  function handleSubmit(e: Event) {
    e.preventDefault();
    if (editingId) {
      saveEdit();
    } else {
      add();
    }
  }
</script>

<h1 class="page-title">Registro de Ausentismo</h1>

<section>
  <form onsubmit={handleSubmit} class="card">
    {#if errors.length}
      <ul class="err">{#each errors as e}<li>{e}</li>{/each}</ul>
    {/if}

    <input
      placeholder="Nombre del operario"
      bind:value={operario}
      class="input"
      maxlength="100"
    />

    <div class="input-group">
      <label for="horas">Horas trabajadas:</label>
      <input
        id="horas"
        type="number"
        min="0"
        max="24"
        step="0.5"
        bind:value={horasTrabajadas}
        class="input"
        placeholder="0 - 24"
      />
    </div>

    <div class="input-group">
      <label for="causa">Causa de fuerza mayor:</label>
      <select bind:value={causaMayorFuerza} class="input" id="causa">
        <option value="">Selecciona una opción</option>
        {#each causasOptions as causa}
          <option value={causa}>{causa}</option>
        {/each}
      </select>
    </div>

    <!-- svelte-ignore element_invalid_self_closing_tag -->
    <textarea
      placeholder="Observaciones adicionales (opcional)"
      bind:value={observaciones}
      class="input textarea"
      maxlength="500"
      rows="4"
    />
    <span class="char-count">{observaciones.length} / 500</span>

    <button type="submit" class="btn btn-success submit-btn">
      {editingId ? 'Guardar cambios' : 'Registrar'}
    </button>

    {#if editingId}
      <button type="button" onclick={cancelEdit} class="btn btn-danger cancel-btn">
        Cancelar
      </button>
    {/if}
  </form>

  <SearchFilter
    placeholder="Buscar por operario o causa"
    on:change={onFilter}
  />

  <div class="table-container">
    <table class="styled-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Operario</th>
          <th>Horas Trabajadas</th>
          <th>Causa</th>
          <th>Observaciones</th>
          <th>Creación</th>
          <th>Modificación</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {#each filtered as it}
          <tr>
            <td>{it.id}</td>
            <td class="bold">{it.operario}</td>
            <td>
              <span class="horas-badge">{it.horasTrabajadas}h</span>
            </td>
            <td>
              <span class="causa-badge {it.causaMayorFuerza.toLowerCase()}">
                {it.causaMayorFuerza}
              </span>
            </td>
            <td class="observaciones">{it.observaciones || '-'}</td>
            <td>{new Date(it.fechaCreacion).toLocaleString()}</td>
            <td>{it.fechaModificacion ? new Date(it.fechaModificacion).toLocaleString() : '-'}</td>
            <td class="acciones">
              <button onclick={() => startEdit(it)} class="btn btn-success btn-sm">
                Editar
              </button>
              <button
                class="btn btn-danger btn-sm"
                onclick={() => askDelete(it.id)}
              >
                Eliminar
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  {#if filtered.length === 0}
    <div class="no-data">
      <p>No hay registros de ausentismo</p>
    </div>
  {/if}

  <ModalConfirm
    bind:open={showModal}
    title="Eliminar registro"
    message="¿Eliminar este registro de ausentismo?"
    on:confirm={confirmDelete}
    on:cancel={cancelDelete}
  />

  <div class="volver-container">
    <button
      type="button"
      class="btn btn-outline-light btn-lg volver-btn"
      onclick={() => enrutador('/ruta_main')}
    >
      Volver al menú principal
    </button>
  </div>
</section>

<style>
  :global(body) {
    background: linear-gradient(135deg, #0a0a0f 0%, #151520 25%, #1a1a2e 50%, #16213e 75%, #0f3460 100%);
    min-height: 100vh;
  }

  .page-title {
    font-size: 2.5rem;
    font-weight: 800;
    color: #fff;
    letter-spacing: -1px;
    margin-top: 2rem;
    margin-bottom: 2rem;
    text-shadow: 0 2px 16px #0008;
    text-align: center;
  }

  section {
    min-height: 100vh;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    gap: 2rem;
    padding-bottom: 50px;
    width: 100%;
  }

  .card {
    background: rgba(255, 255, 255, 0.07);
    border-radius: 1.5rem;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
    padding: 2.5rem 2rem 2rem 2rem;
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.2rem;
    min-width: 340px;
    max-width: 480px;
    width: 100%;
    border: 1px solid rgba(255, 255, 255, 0.13);
    backdrop-filter: blur(12px);
  }

  .input {
    width: 100%;
    padding: 0.9rem 1.2rem;
    border-radius: 1rem;
    border: 1px solid #4f83f7;
    background: rgba(255, 255, 255, 0.13);
    color: #fff;
    font-size: 1.1rem;
    outline: none;
    transition: border 0.2s;
  }

  .input:focus {
    border: 2px solid #76a9fa;
    background: rgba(255, 255, 255, 0.18);
  }

  .input-group {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .input-group label {
    color: #76a9fa;
    font-weight: 600;
    font-size: 1rem;
  }

  .textarea {
    resize: vertical;
    font-family: inherit;
  }

  .char-count {
    color: #bbb;
    font-size: 0.9rem;
    text-align: right;
  }

  .err {
    color: #ff4d4f;
    background: rgba(255, 77, 79, 0.08);
    border-radius: 0.7rem;
    padding: 0.7rem 1.2rem;
    margin: 8px 0;
    font-weight: 500;
    font-size: 1rem;
    list-style: disc inside;
    box-shadow: 0 2px 8px #0002;
    width: 100%;
  }

  .submit-btn {
    width: 100%;
    font-size: 1.2rem;
    margin-top: 0.5rem;
    border-radius: 1rem;
    padding: 0.8rem 0;
    font-weight: 700;
    background: linear-gradient(90deg, #76a9fa 0%, #4f83f7 100%);
    border: none;
    color: #fff;
    box-shadow: 0 4px 16px #4f83f733;
    transition: background 0.2s;
  }

  .submit-btn:hover {
    background: linear-gradient(90deg, #4f83f7 0%, #76a9fa 100%);
  }

  .cancel-btn {
    width: 100%;
    margin-top: 0.2rem;
    border-radius: 1rem;
    padding: 0.7rem 0;
    font-weight: 600;
    font-size: 1.1rem;
  }

  .search-filter {
    width: 100%;
    max-width: 480px;
    margin-bottom: 1rem;
  }

  .table-container {
    width: 100%;
    max-width: 1400px;
    overflow-x: auto;
    margin-top: 1rem;
    border-radius: 1.2rem;
    box-shadow: 0 4px 24px #0003;
    background: rgba(255, 255, 255, 0.06);
    padding: 1.2rem 0.5rem;
  }

  .styled-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    background: transparent;
    color: #fff;
    font-size: 1.05rem;
    border-radius: 1rem;
    overflow: hidden;
  }

  .styled-table th,
  .styled-table td {
    padding: 0.7rem 0.8rem;
    border-bottom: 1px solid #4f83f733;
    text-align: left;
    vertical-align: middle;
    background: transparent;
  }

  .styled-table th {
    background: rgba(79, 131, 247, 0.13);
    font-weight: 700;
    color: #76a9fa;
    border-top: 1px solid #4f83f733;
  }

  .styled-table tr:last-child td {
    border-bottom: none;
  }

  .bold {
    font-weight: 700;
    color: #76a9fa;
  }

  .horas-badge {
    background: rgba(118, 169, 250, 0.2);
    color: #76a9fa;
    padding: 0.3rem 0.8rem;
    border-radius: 0.8rem;
    font-weight: 600;
    border: 1px solid #76a9fa;
    display: inline-block;
  }

  .causa-badge {
    padding: 0.3rem 0.8rem;
    border-radius: 1rem;
    font-weight: 600;
    font-size: 1rem;
    text-transform: capitalize;
    display: inline-block;
    border: 1px solid;
  }

  .causa-badge.enfermedad {
    background: rgba(255, 193, 7, 0.15);
    color: #ffc107;
    border-color: #ffc107;
  }

  .causa-badge.accidente {
    background: rgba(244, 67, 54, 0.15);
    color: #f44336;
    border-color: #f44336;
  }

  .causa-badge.calamidad {
    background: rgba(156, 39, 176, 0.15);
    color: #9c27b0;
    border-color: #9c27b0;
  }

  .causa-badge.licencia {
    background: rgba(76, 175, 80, 0.15);
    color: #4caf50;
    border-color: #4caf50;
  }

  .causa-badge.otro {
    background: rgba(158, 158, 158, 0.15);
    color: #9e9e9e;
    border-color: #9e9e9e;
  }

  .observaciones {
    max-width: 200px;
    word-break: break-word;
    color: #ddd;
  }

  .acciones {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .btn {
    border-radius: 1rem;
    font-weight: 600;
    transition: all 0.2s;
    box-shadow: 0 2px 8px #0001;
    outline: none;
    border: none;
    cursor: pointer;
  }

  .btn-sm {
    font-size: 0.95rem;
    padding: 0.4rem 0.9rem;
  }

  .btn-success {
    background: linear-gradient(90deg, #4caf50 0%, #45a049 100%);
    color: #fff;
  }

  .btn-success:hover {
    background: linear-gradient(90deg, #45a049 0%, #4caf50 100%);
  }

  .btn-danger {
    background: #ff4d4f;
    color: #fff;
  }

  .btn-danger:hover {
    background: #d9363e;
  }

  .btn-outline-light {
    background: transparent;
    color: #fff;
    border: 1.5px solid #fff;
  }

  .btn-outline-light:hover {
    background: #fff;
    color: #4f83f7;
  }

  .btn-lg {
    font-size: 1.2rem;
    padding: 0.8rem 2.2rem;
  }

  .no-data {
    text-align: center;
    color: #bbb;
    font-size: 1.2rem;
    padding: 2rem;
  }

  .volver-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;
    width: 100%;
  }

  .volver-btn {
    width: 100%;
    max-width: 480px;
    border-radius: 1.2rem;
    font-weight: 700;
    letter-spacing: 0.5px;
    box-shadow: 0 2px 12px #0002;
  }

  @media (max-width: 700px) {
    .card,
    .volver-btn,
    .search-filter {
      max-width: 98vw;
    }
    .table-container {
      max-width: 99vw;
    }
    .styled-table th,
    .styled-table td {
      font-size: 0.97rem;
      padding: 0.5rem 0.4rem;
    }
    .observaciones {
      max-width: 120px;
    }
  }
</style>
