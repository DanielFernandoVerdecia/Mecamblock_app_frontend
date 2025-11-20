<script lang="ts">
  import InspectionForm from '$lib/components/defectos/InspectionForm.svelte';
  import InspectionList from '$lib/components/defectos/InspectionList.svelte';
  import {enrutador} from '../../routes/router_now'
</script>


<h1 style="text-align: center; margin-top: 2rem;">HU02 - Defectos / Inspecciones</h1>

<div style="display:flex; gap:2rem; align-items:flex-start;">
  <div style="flex:1;">
    <InspectionForm />
  </div>

  <div style="flex:1;">
    <InspectionList />
  </div>
</div>

<div style = "display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
    margin-top: 2rem;
    "
    
    >

  <button type="button" class="btn btn-secondary btn-lg"
  on:click = {()=> enrutador('/ruta_main')}
  >
    Volver al menú principal
  </button>

</div>
