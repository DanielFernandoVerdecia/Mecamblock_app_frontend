<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/icon_mecamblock.png';
	import "bootstrap/dist/css/bootstrap.min.css";
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { authStore } from '$lib/stores/authStore';
	import { onMount } from 'svelte';

	let { children } = $props();
	let isLoggedIn = $state(false);
	let isInitialized = $state(false);

	// Rutas públicas (sin protección)
	const publicRoutes = ['/login'];

	onMount(() => {
		// Subscribirse después del mount para obtener el estado inicial
		const unsubscribe = authStore.subscribe(state => {
			isLoggedIn = state.isLoggedIn;
			isInitialized = true;

			const currentPath = $page.url.pathname;
			const isPublicRoute = publicRoutes.some(route => currentPath.startsWith(route));

			// Si no está logueado y no es ruta pública, redirigir a login
			if (!state.isLoggedIn && !isPublicRoute) {
				goto('/login');
			}
		});

		return unsubscribe;
	});

	$effect(() => {
		if (!isInitialized) return;

		const currentPath = $page.url.pathname;
		const isPublicRoute = publicRoutes.some(route => currentPath.startsWith(route));

		// Si no está logueado y no es ruta pública, redirigir a login
		if (!isLoggedIn && !isPublicRoute) {
			goto('/login');
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if !isInitialized}
	<div style="display: flex; align-items: center; justify-content: center; height: 100vh; background: linear-gradient(135deg, #0a0a0f 0%, #151520 25%, #1a1a2e 50%, #16213e 75%, #0f3460 100%);"></div>
{:else}
	{@render children()}
{/if}
