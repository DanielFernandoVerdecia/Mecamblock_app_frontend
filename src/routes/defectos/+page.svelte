<script lang="ts">
    import DefectoForm from '$lib/components/defectos/DefectoForm.svelte';
    import DefectList from '$lib/components/defectos/DefectList.svelte';

    let threshold = 5;
</script>

<h1>Registrar y Revisar Defectos</h1>

<div style="display:flex; gap:2rem; align-items:flex-start;">
    <div style="flex:1;">
        <DefectoForm />
    </div>

    <div style="flex:1;">
        <DefectList {threshold} />
    </div>
</div>
