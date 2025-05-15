<template>
	<div class="flex flex-col h-screen">
		<header class="bg-gray-800 text-white p-4 shadow-md">
			<h1 class="text-xl font-semibold">Mapa Interactivo de Asociaciones</h1>
		</header>
		<main class="flex-1 relative">
			<div class="map-container absolute inset-0">
				<ClientOnly>
					<BaseMap v-if="entities.length" :entities="entities" :hubs="hubs" markerType="logo" interactive
						@marker-click="handleMarkerClick" />
					<div v-else class="flex items-center justify-center h-full text-gray-500">
						Cargando mapa...
					</div>
				</ClientOnly>
			</div>
		</main>

		<USlideover v-model:open="isModalOpen" :prevent-close="false">

			<template #header>
				<div class="flex items-center justify-between w-full">
					<div class="flex items-center gap-4">
						<img v-if="selectedEntity?.logoLink" :src="selectedEntity.logoLink"
							class="h-8 w-8 object-contain" />
						<h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
							{{ selectedEntity?.name }}
						</h3>
					</div>
					<UButton color="neutral" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
						@click="isModalOpen = false" />
				</div>
			</template>
			<template #body>
				<div class="p-4 flex flex-col flex-1 overflow-y-auto h-full gap-6">
					<div>
						<h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">Descripción</h4>
						<p class="text-sm text-gray-500 dark:text-gray-400">
							{{ selectedEntity?.objective || 'No disponible' }}
						</p>
					</div>

					<div v-if="selectedEntity?.description">
						<h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">Objetivo</h4>
						<p class="text-sm text-gray-500 dark:text-gray-400">
							{{ selectedEntity.description }}
						</p>
					</div>

					<div v-if="selectedEntity?.activities">
						<h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">Actividades</h4>
						<p class="text-sm text-gray-500 dark:text-gray-400">
							{{ selectedEntity.activities }}
						</p>
					</div>

					<div v-if="selectedEntity?.participate">
						<h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">Cómo Participar</h4>
						<p class="text-sm text-gray-500 dark:text-gray-400">
							{{ selectedEntity.participate }}
						</p>
					</div>

					<div v-if="selectedEntity?.schedule">
						<h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">Horario</h4>
						<p class="text-sm text-gray-500 dark:text-gray-400">
							{{ selectedEntity.schedule }}
						</p>
					</div>

					<div v-if="selectedEntity?.contact">
						<h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">Contacto</h4>
						<p class="text-sm text-gray-500 dark:text-gray-400">
							{{ selectedEntity.contact }}
						</p>
					</div>

					<div v-if="selectedEntity?.observations">
						<h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">Observaciones</h4>
						<p class="text-sm text-gray-500 dark:text-gray-400">
							{{ selectedEntity.observations }}
						</p>
					</div>
				</div>
			</template>
		</USlideover>

	</div>
</template>

<script lang="ts" setup>
import type { Entity, Hub } from '~/utils/types';
// Importar BaseMap en lugar de InteractiveMap
import BaseMap from '~/components/BaseMap.vue';
import { useRoute } from 'vue-router';

// Lógica para obtener los datos de las entidades si es necesario
const { data } = await useFetch<{ entities: Entity[], hubs: Record<string, Hub[]> }>('/api/entities')

const entities = computed(() => data.value?.entities ?? [])
const hubs = computed(() => data.value?.hubs ?? {})

// Lógica del Slideover movida aquí
const isModalOpen = ref(false)
const selectedEntity = ref<Entity | null>(null)

function handleMarkerClick(entity: Entity) {
	selectedEntity.value = entity;
	isModalOpen.value = true;
}

// Manejar query param para abrir slideover
const route = useRoute();

watchEffect(() => {
	console.log('watchEffect triggered. Query:', route.query.entity, 'Entities loaded:', entities.value.length > 0);
	let entityIdFromQuery = route.query.entity;

	if (Array.isArray(entityIdFromQuery)) {
		entityIdFromQuery = entityIdFromQuery[0];
	}

	console.log('Effective entityIdFromQuery:', entityIdFromQuery);

	if (entityIdFromQuery && entities.value.length > 0) {
		console.log('Searching for entity...');
		const foundEntity = entities.value.find(e => {
			return String(e.id) === entityIdFromQuery;
		});

		if (foundEntity) {
			console.log('Entity found:', foundEntity, 'Opening slideover.');
			handleMarkerClick(foundEntity);
		} else {
			console.warn(`Entity with id "${entityIdFromQuery}" not found.`);
		}
	}
});

</script>

<style scoped>
/* Se eliminan los estilos anteriores ya que usamos Tailwind/UnoCSS */
/* Si necesitas estilos específicos que no se puedan lograr con clases de utilidad, añádelos aquí. */
</style>
