<template>
	<div class="map-container">
		<!-- Aquí irá el componente del mapa interactivo -->
		<ClientOnly>
			<InteractiveMap v-if="entities.length" :entities="entities" :hubs="hubs" />
			<div v-else>
				Cargando mapa...
			</div>
		</ClientOnly>
	</div>
</template>

<script lang="ts" setup>
import type { Entity, Hub } from '~/utils/types';

// Lógica para obtener los datos de las entidades si es necesario
const { data } = await useFetch<{ entities: Entity[], hubs: Record<string, Hub[]> }>('/api/entities')

const entities = computed(() => data.value?.entities ?? [])
const hubs = computed(() => data.value?.hubs ?? {})
</script>

<style scoped>
.map-container {
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	/* Para asegurar que el mapa ocupe toda la pantalla */
}
</style>
