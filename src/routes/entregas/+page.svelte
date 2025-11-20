<script lang="ts">
  import { onDestroy } from 'svelte';
  import { entregasStore } from '../../stores/entregasStore';
  import { Entrega } from '$lib/models/entrega'; 
  import ModalConfirm from '$lib/components/ModalConfirm.svelte';
  import SearchFilter from '$lib/components/SearchFilter.svelte';
  import BootstrapModal from '$lib/components/BootstrapModal.svelte';
  import Signature from '$lib/components/Signature.svelte'; 

  import {enrutador} from '../../routes/router_now'

  // Form state
  let cliente = '';
  let documento = '';
  let currentFirma = ''; // <--- NUEVA VARIABLE para la firma temporal
  let editingId: number | null = null; 
  let errors: string[] = [];

  let list: Entrega[] = [];
  const unsub = entregasStore.subscribe(v => list = v as Entrega[]); 
  onDestroy(() => unsub());

  // Filter
  let q = '';
  function onFilter(e: CustomEvent) { q = e.detail.value} // [cite: 6]

  function validate() {
    errors = [];
    const c = cliente.trim();
    if (!c) errors.push('Cliente es requerido');
    if (c.length > 100) errors.push('Cliente demasiado largo');
    return errors.length === 0;
  }

  function add() {
    if (!validate()) return;
    // --- MODIFICADO: Pasamos currentFirma al constructor ---
    const e = new Entrega(cliente.trim(), documento.trim() || undefined, currentFirma || undefined);
    entregasStore.add(e);
    
    // Limpiamos el formulario
    cliente = '';
    documento = '';
    currentFirma = ''; // <--- Limpiamos la firma temporal
  }

  function startEdit(item: Entrega) {
    editingId = item.id;
    cliente = item.cliente;
    documento = item.documento || '';
    currentFirma = item.firma || ''; // <--- Cargamos la firma existente si la hay
  }

  function saveEdit() {
    if (editingId === null || !validate()) return;
    entregasStore.replace(
      x => x.id === editingId,
      // --- MODIFICADO: Guardamos también la firma actualizada ---
      x => ({ 
        ...x, 
        cliente: cliente.trim(), 
        documento: documento.trim() || undefined, 
        firma: currentFirma || undefined, // Actualizamos firma
        fechaModificacion: new Date().toISOString() 
      })
    );
    editingId = null;
    cliente = '';
    documento = '';
    currentFirma = ''; // <--- Limpiamos
  }

  // ... (código de delete modal sin cambios) ...
  // delete modal
  let showModal = false;
  let idToDelete: number | null = null;
  function askDelete(id: number) { idToDelete = id; showModal = true; }
  function confirmDelete() {
    if (idToDelete !== null) entregasStore.remove(x => x.id === idToDelete);
    showModal = false;
    idToDelete = null;
  }
  function cancelDelete() { showModal = false; idToDelete = null; }

  $: filtered = list.filter(it => !q || it.cliente.toLowerCase().includes(q.toLowerCase()));

  // Signature modal control
  let showSignatureModal = false;
  function openSignature() { showSignatureModal = true; }

  function onSignatureSaved(e: CustomEvent) {
    // --- MODIFICADO: Capturamos el dataUrl del evento ---
    console.log('Signature saved', e.detail);
    
    if (e.detail.dataUrl) {
        currentFirma = e.detail.dataUrl; // Guardamos la imagen en nuestra variable
    }
    
    showSignatureModal = false; 
  }


  // ... tus otras variables ...
  let fileInput: HTMLInputElement; // 1. Referencia al elemento input invisible

  // 2. Función para manejar la subida
  function handleFileUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) return;

    // Validación opcional: Verificar que sea imagen
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecciona un archivo de imagen válido.');
      return;
    }

    // Validación opcional: Tamaño (LocalStorage tiene límite de ~5MB)
    // Si la imagen pesa más de 500KB, advertimos (opcional)
    if (file.size > 500 * 1024) { 
       const confirmar = confirm("La imagen es muy pesada y podría llenar el almacenamiento rápido. ¿Deseas continuar?");
       if(!confirmar) return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      // Al terminar de leer, el resultado es un string Base64
      if (e.target?.result) {
          currentFirma = e.target.result as string;
      }
    };

    // Leemos el archivo como URL de datos (Base64)
    reader.readAsDataURL(file);
    
    // Limpiamos el input para permitir subir la misma foto de nuevo si se equivocó
    target.value = ''; 
  }

</script>

<h1 style="text-align: center; margin-top: 2rem;">Comprobante de entrega</h1>



<section>
  <form on:submit|preventDefault={editingId ? saveEdit : add}>
    {#if errors.length}
      <ul class="err">{#each errors as e}<li>{e}</li>{/each}</ul>
    {/if}
    <input placeholder="Cliente" bind:value={cliente} />
    <input placeholder="Documento (opcional)" bind:value={documento} />

    {#if currentFirma}
        <div style="text-align: center; margin: 0.5rem;">
            <span style="color: blue;">¡Firma capturada!</span>
            <br>

            <img src={currentFirma} alt="Vista previa firma" 
            style="max-height: 20rem; border: 5px solid #ccc;"
             />

            <button type="button" style="font-size: 1.5rem;" class="btn btn-primary" on:click={() => currentFirma = ''}>
              Borrar Firma
            </button>

        </div>
    {/if}

     <button
      type="button"
      style="font-size: 1.5rem;"
      class="btn btn-primary"
      on:click={openSignature}
      >
        {currentFirma ? 'Cambiar Firma ' : 'Firmar '}
      </button>

    <input 
        type="file" 
        accept="image/*" 
        style="display: none;" 
        bind:this={fileInput} 
        on:change={handleFileUpload}
    />

    <button 
        type="button" 
        style="font-size: 1.5rem;" 
        class="btn btn-primary"
        on:click={() => fileInput.click()} 
    >
      Subir Foto
    </button>
     
    <button type="submit" class="btn btn-primary" style="font-size: 1.5rem;">
      {editingId ? 'Guardar' : 'Registrar'}
    </button>

    <BootstrapModal bind:open={showSignatureModal} title="Firmar comprobante" size="modal-lg" on:cancel={() => showSignatureModal = false}>
      <Signature on:saved={onSignatureSaved} />
      <div slot="footer">
        <button type="button" class="btn btn-secondary" on:click={() => (showSignatureModal = false)}>Cerrar</button>
      </div>
    </BootstrapModal>

    {#if editingId}

      <button type="button" on:click={() => { editingId = null; cliente = ''; documento = ''; currentFirma = ''; }}
      class="btn btn-danger"  
      >
        Cancelar
      </button>

    {/if}
  </form>

  <SearchFilter placeholder="Buscar por cliente" on:change={onFilter} />

  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Cliente</th>
        <th>Documento</th>
        <th>Firma</th> <th>Estado</th>
        <th>Creación</th>
        <th>Modificación</th>
        <th>Acciones</th>
      </tr>
    </thead>
   
    <tbody>
      {#each filtered as it}
        <tr>
          <td>{it.id}</td>
          <td>{it.cliente}</td>
          <td>{it.documento ?? '-'}</td>
          
          <td style="text-align: center;">
            {#if it.firma}
                <img src={it.firma} alt="Firma" style="max-height: 8rem;" />
            {:else}
                <span style="color: #999;">-</span>
            {/if}
          </td>

          <td>{it.estado}</td>
          <td>{new Date(it.fechaCreacion).toLocaleString()}</td>
          <td>{it.fechaModificacion ? new Date(it.fechaModificacion).toLocaleString() : '-'}</td>
          <td>
             <button class="btn btn-secondary" on:click={() => entregasStore.replace(
                  x => x.id === it.id,
                  x => ({ ...x, estado: x.estado === 'pendiente' ? 'entregado' : x.estado === 'entregado' ? 'finalizado' : x.estado, fechaModificacion: new Date().toISOString() })
                )}>
              Cambiar estado
            </button>

            <button on:click={() => startEdit(it)} class="btn btn-success">Editar</button>
            <button class="btn btn-danger" on:click={() => askDelete(it.id)}>Eliminar</button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>

  <ModalConfirm bind:open={showModal} title="Eliminar comprobante" message="¿Eliminar este comprobante?" on:confirm={confirmDelete} on:cancel={cancelDelete} />


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

</section>

<style>
  .err { color: red; margin: 8px 0; }
  table { width: 100%; border-collapse: collapse; margin-top: 12px; }
  th, td { border: 1px solid #ddd; padding: 6px; text-align: left; vertical-align: middle; } /* Agregué vertical-align */
  button { margin-right: 6px; }
  form{ display: flex; justify-content: center; flex-direction: column; align-items: center; gap: 2rem; }
  section{ min-height: 100vh; display: flex; justify-content: start; align-items: center; flex-direction: column; gap: 2rem; padding-bottom: 50px; } /* Ajusté section para que no corte contenido si es muy largo */
</style>