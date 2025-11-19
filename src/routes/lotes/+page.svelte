<script lang="ts">
    import AgregarLoteForm from '$lib/components/lotes/AgregarLoteForm.svelte';
    import ListaLotes from '$lib/components/lotes/ListaLotes.svelte';
</script>

<h1>Gestión de Lotes</h1>

<div style="display:flex; gap:2rem;">
    <div style="flex:1;">
        <AgregarLoteForm />
    </div>

    <div style="flex:1;">
        <ListaLotes />
    </div>
</div>
