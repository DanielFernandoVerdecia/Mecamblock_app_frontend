<script lang="ts">
    export let headers: string[] = [];
    export let rows: any[] = [];
</script>


<table>

    <thead>
        <tr>{#each headers as h}
            <th>{h}</th>{/each}
        </tr>
    </thead>
    
    <tbody>
        {#each rows as r}
        <tr>
            {#each Object.values(r) as cell}<td>{cell}</td>{/each}
        </tr>
        {/each}
    </tbody>
    
</table>