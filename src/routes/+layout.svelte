<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/icon_mecamblock.png';
	import "bootstrap/dist/css/bootstrap.min.css";
	
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
