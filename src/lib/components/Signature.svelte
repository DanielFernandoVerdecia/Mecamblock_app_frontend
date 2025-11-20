<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';

  export let width = 800;            // ancho lógico del canvas (px)
  export let height = 300;           // alto lógico del canvas (px)
  export let bgColor = '#ffffff';
  export let strokeColor = '#000000';
  export let strokeWidth = 2;        // anchura del trazo en px (lógico)
  export let storageKey = 'signature'; // key en localStorage
  export let compressWidth = 800;    // ancho objetivo al comprimir (px). Pon null para no escalar.
  export let mimeType = 'image/webp';// 'image/webp' o 'image/jpeg'
  export let quality = 0.6;          // 0..1 calidad de compresión

  const dispatch = createEventDispatcher();

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null = null;
  let drawing = false;
  let lastX = 0;
  let lastY = 0;
  let hasSigned = false;
  let pointerId: number | null = null;
  let movementAccum = 0; // distancia acumulada para detectar "firma"
  const SIGN_THRESHOLD = 6; // px de movimiento para considerar que hay un trazo

  function setupCanvas() {
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    // fondo
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
  }

  function pointerDown(e: PointerEvent) {
    if (!ctx) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointerId = e.pointerId;
    drawing = true;
    lastX = (e.offsetX ?? (e.clientX - canvas.getBoundingClientRect().left));
    lastY = (e.offsetY ?? (e.clientY - canvas.getBoundingClientRect().top));
    movementAccum = 0;
  }

  function pointerMove(e: PointerEvent) {
    if (!drawing || pointerId !== e.pointerId || !ctx) return;
    const x = (e.offsetX ?? (e.clientX - canvas.getBoundingClientRect().left));
    const y = (e.offsetY ?? (e.clientY - canvas.getBoundingClientRect().top));
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    const dx = x - lastX;
    const dy = y - lastY;
    movementAccum += Math.hypot(dx, dy);
    lastX = x;
    lastY = y;

    if (!hasSigned && movementAccum > SIGN_THRESHOLD) {
      hasSigned = true;
      // evento que notifica que usuario firmó (o hizo un trazo)
      dispatch('signed', { when: new Date().toISOString() });
    }
  }

  function pointerUp(e: PointerEvent) {
    if (!ctx) return;
    drawing = false;
    pointerId = null;
    try {
      (e.target as Element).releasePointerCapture?.(e.pointerId);
    } catch {}
  }

  function clearCanvas() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    hasSigned = false;
    movementAccum = 0;
    localStorage.removeItem(storageKey);
    dispatch('cleared');
  }

  // Crea una versión comprimida (escalada si compressWidth < width)
  function getCompressedDataUrl(): string {
    if (!canvas) return '';
    // 1) sacar imagen actual como bitmap desde un canvas base (sin perder calidad)
    // 2) dibujar en offscreen con el tamaño target
    const originalCanvas = document.createElement('canvas');
    originalCanvas.width = canvas.width;
    originalCanvas.height = canvas.height;
    const octx = originalCanvas.getContext('2d')!;
    // Necesitamos dibujar con el tamaño lógico: canvas.style.width x canvas.style.height en device pixels ya
    // Dibujar la actual a tamaño completo:
    octx.drawImage(canvas, 0, 0);

    // calcular tamaño objetivo (mantener aspect ratio)
    let targetWidth = compressWidth ?? (width);
    // si compressWidth > original logical width, no subir; mantener original logical width
    if (compressWidth && compressWidth > width) targetWidth = width;

    const ratio = targetWidth / width;
    const targetHeight = Math.round(height * ratio);

    const off = document.createElement('canvas');
    off.width = Math.round(targetWidth * (window.devicePixelRatio || 1));
    off.height = Math.round(targetHeight * (window.devicePixelRatio || 1));
    off.style.width = `${targetWidth}px`;
    off.style.height = `${targetHeight}px`;

    const offCtx = off.getContext('2d')!;
    // Escalar con drawImage (el navegador hará resampling)
    offCtx.drawImage(originalCanvas, 0, 0, off.width, off.height);

    // devolver dataURL comprimido
    // asegurarse de que quality esté entre 0 y 1
    const q = Math.max(0.01, Math.min(1, quality));
    // Algunos navegadores no soportan 'image/webp', en ese caso caerá a jpeg.
    try {
      return off.toDataURL(mimeType, q);
    } catch (err) {
      return off.toDataURL('image/jpeg', q);
    }
  }

  function saveToLocalStorage() {
    const dataUrl = getCompressedDataUrl();
    if (!dataUrl) return null;
    try {
      localStorage.setItem(storageKey, dataUrl);
      const bytes = base64BytesSize(dataUrl);
      
      // --- MODIFICACIÓN AQUÍ ---
      // Agregamos 'dataUrl' al detalle del evento dispatch
      dispatch('saved', { 
          dataUrl, // <--- Importante: enviamos la imagen al padre
          sizeBytes: bytes, 
          mimeType, 
          timestamp: new Date().toISOString() 
      });
      // -------------------------

      return { dataUrl, sizeBytes: bytes };
    } catch (err) {
      console.error('Error saving to localStorage', err);
      dispatch('error', { message: 'Error al guardar en localStorage' });
      return null;
    }
  }

  function loadFromLocalStorage() {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return null;
    // mostrar imagen en canvas:
    const img = new Image();
    img.onload = () => {
      if (!ctx) return;
      // limpiar y dibujar centrado
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);
      // ajustar para que ocupe todo el canvas manteniendo aspect ratio
      ctx.drawImage(img, 0, 0, width, height);
    };
    img.src = saved;
    return saved;
  }

  // util: estimar bytes de un dataURL base64
  function base64BytesSize(dataUrl: string) {
    const base64 = dataUrl.split(',')[1] ?? '';
    const padding = (base64.endsWith('==') ? 2 : (base64.endsWith('=') ? 1 : 0));
    return Math.round((base64.length * 3) / 4 - padding);
  }

  onMount(() => {
    setupCanvas();
    // listeners pointer
    canvas.addEventListener('pointerdown', pointerDown);
    canvas.addEventListener('pointermove', pointerMove);
    canvas.addEventListener('pointerup', pointerUp);
    canvas.addEventListener('pointercancel', pointerUp);
    // si había guardado, cargar preview
    loadFromLocalStorage();
  });

  onDestroy(() => {
    if (!canvas) return;
    canvas.removeEventListener('pointerdown', pointerDown);
    canvas.removeEventListener('pointermove', pointerMove);
    canvas.removeEventListener('pointerup', pointerUp);
    canvas.removeEventListener('pointercancel', pointerUp);
  });
</script>

<div class="d-flex flex-column">

  <h1>Debes firmar con el Mouse (haciendo presión) o puedes usar tu pantalla táctil</h1>
  <div class="border mb-2" style="max-width:100%; overflow:hidden;">
    <canvas bind:this={canvas} class="w-100" style="touch-action: none; display:block;"></canvas>
  </div>

  <div class="d-flex gap-2">
    <button class="btn btn-primary btn-sm" type="button" on:click={() => { const r = saveToLocalStorage(); /* opcional: manejar r */ }}>
      Guardar (comprimido)
    </button>
    <button class="btn btn-secondary btn-sm" type="button" on:click={clearCanvas}>
      Limpiar
    </button>
    <button class="btn btn-outline-secondary btn-sm" type="button" on:click={loadFromLocalStorage}>
      Cargar guardado (preview)
    </button>
    <div class="ms-auto align-self-center">
      <small class="text-muted">Firma detectada: {hasSigned ? 'Sí' : 'No'}</small>
    </div>
  </div>
</div>

<style>
  canvas {
    background: transparent;
    border-radius: 4px;
  }
</style>
