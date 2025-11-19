<script lang="ts">
    import { defectosStore } from '../../../stores/defectosStore';
    import { lotesStore } from '../../../stores/lotesStore';
    import { get } from 'svelte/store';

    export let threshold = 5;

    function contar(loteId: number) {
        return get(defectosStore).filter(d => d.loteId === loteId).length;
    }

    function ponerEnEspera(loteId: number) {
        lotesStore.replace(l => l.id === loteId, l => ({
            ...l,
            estado: 'en_espera',
            fechaModificacion: new Date().toISOString()
        }));
    }
</script>

<div class="card">
    <h2>Defectos por Lote</h2>

    {#each $lotesStore as lote}
        <div class="lote">
            <strong>{lote.nombre}</strong> — {lote.estado}
            <br>
            Defectos: {contar(lote.id)}

            {#if contar(lote.id) >= threshold}
                <div class="alert">
                    ⚠️ Umbral superado ({contar(lote.id)} ≥ {threshold})
                    <button on:click={() => ponerEnEspera(lote.id)}>
                        Poner lote en espera
                    </button>
                </div>
            {/if}

            <ul>
            {#each $defectosStore.filter(d => d.loteId === lote.id) as def}
                <li>
                    {def.producto} — {def.descripcion} ({def.gravedad})
                </li>
            {/each}
            </ul>
        </div>
    {/each}
</div>

<style>
.lote { margin-bottom: 1rem; padding-bottom: .5rem; border-bottom: 1px solid #eee; }
.alert {
    background: #fff3cd;
    padding: .5rem;
    margin-top: .5rem;
    border-radius: 6px;
}
.card {
    padding: 1rem;
    border-radius: 8px;
    background: white;
    box-shadow: 0 2px 8px rgba(0,0,0,.1);
}
</style>
