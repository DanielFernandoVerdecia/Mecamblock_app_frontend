<script lang="ts">
  import Signature from '$lib/components/Signature.svelte';
  let savedPreview: string | null = null;

  function onSigned(e: CustomEvent) {
    console.log('Usuario dibujó / firmó:', e.detail);
    // puedes habilitar UI, cambiar estado, etc.
  }

  function onSaved(e: CustomEvent) {
    console.log('Guardado:', e.detail);
    // mostrar preview
    savedPreview = localStorage.getItem('signature');
  }

  function onCleared() {
    savedPreview = null;
  }
</script>

<div >
  <h4>Firma</h4>
  <Signature
    width={600}
    height={200}
    strokeWidth={3}
    storageKey="signature"
    compressWidth={600}
    mimeType="image/webp"
    quality={0.5}
    on:signed={onSigned}
    on:saved={onSaved}
    on:cleared={onCleared}
  />
  <div class="mt-3">
    <h6>Previsualización guardada (desde localStorage)</h6>
    {#if savedPreview}
      <img src={savedPreview} alt="Preview firma" class="img-fluid border" style="max-height:200px;">
      <p class="small text-muted">Bytes aprox: {Math.round((savedPreview.length*3)/4)}</p>
    {:else}
      <p class="text-muted">No hay firma guardada.</p>
    {/if}
  </div>
</div>
