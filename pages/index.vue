<template>
	<div class="flex flex-col h-screen">
		<header class="bg-gray-800 text-white p-4 shadow-md">
			<div class="flex flex-col gap-2">
				<h1 class="text-xl font-semibold">Mapa Interactivo de Asociaciones</h1>
				<div class="flex flex-col md:flex-row md:items-center gap-3 mt-1">
					<UInput
						v-model="searchQuery"
						placeholder="Buscar por nombre, actividad..."
						icon="i-heroicons-magnifying-glass-20-solid"
						class="w-full md:w-72"
					/>
					<div class="flex flex-wrap gap-2">
						<UButton
							v-for="layer in layers"
							:key="layer.id"
							:size="'xs'"
							:variant="isLayerActive(layer.id) ? 'solid' : 'outline'"
							:color="isLayerActive(layer.id) ? 'primary' : 'neutral'"
							@click="toggleLayer(layer.id)"
						>
							{{ layer.label }}
						</UButton>
					</div>
				</div>
			</div>
		</header>
		<main class="flex-1 relative">
			<div class="map-container absolute inset-0">
				<ClientOnly>
					<BaseMap
						v-if="filteredEntities.length"
						:entities="filteredEntities"
						:hubs="hubs"
						markerType="logo"
						interactive
						@marker-click="handleMarkerClick"
						@visible-change="handleVisibleChange"
					/>
					<div v-else class="flex items-center justify-center h-full text-gray-500">
						Cargando mapa...
					</div>
				</ClientOnly>
			</div>

			<!-- Panel lateral con lista de puntos visibles -->
			<div class="pointer-events-none absolute inset-y-4 right-4 w-80 max-w-full z-20">
				<div class="pointer-events-auto bg-white/90 shadow-lg rounded-lg border border-gray-200 flex flex-col max-h-full">
					<div class="px-3 py-2 border-b border-gray-200 flex items-center justify-between">
						<h2 class="text-sm font-semibold text-gray-800">
							Puntos visibles ({{ visibleEntities.length }})
						</h2>
					</div>
					<div class="overflow-y-auto p-2 space-y-2 text-sm">
						<div
							v-for="entity in visibleEntities"
							:key="entity.id"
							class="flex items-start gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
							@click="handleMarkerClick(entity)"
						>
							<div class="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
								<img v-if="entity.logoLink" :src="entity.logoLink" alt="" class="h-full w-full object-contain" />
								<span v-else class="text-xs text-gray-500">{{ entity.name.charAt(0) }}</span>
							</div>
							<div class="flex-1 min-w-0">
								<p class="font-medium text-gray-900 truncate">{{ entity.name }}</p>
								<p v-if="entity.objective" class="text-xs text-gray-600 line-clamp-2">
									{{ entity.objective }}
								</p>
							</div>
						</div>
						<div v-if="!visibleEntities.length" class="text-xs text-gray-500 italic">
							Mueve o acerca el mapa para ver puntos aquí.
						</div>
					</div>
				</div>
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

					<!--
          <div v-if="selectedEntity?.contact">
						<h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">Contacto</h4>
						<p class="text-sm text-gray-500 dark:text-gray-400">
							{{ selectedEntity.contact }}
						</p>
					</div>
          -->

					<div v-if="selectedEntity?.contact_items">
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">Contacto</h4>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div v-for="(item, index) in selectedEntity.contact_items" :key="index" :class="{ 'mb-4': index !== selectedEntity.contact_items.length - 1 }">
                <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-1"><UIcon :name="listDetails[item.type]?.icon || 'material-symbols:info-outline'" class="size-5 me-2" />{{ listDetails[item.type]?.text }}</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  <a :href="`${listDetails[item.type]?.urlPrefix || ''}${item.value.replace('@', '')}`" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">
                    {{ item.value }}
                  </a>
                </p>
              </div>
            </div>
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

// Lista de entidades actualmente visibles en el mapa
const visibleEntities = ref<Entity[]>([])

function handleVisibleChange(entities: Entity[]) {
	visibleEntities.value = entities
}

// --- Buscador y capas ---
const searchQuery = ref('')

const layers = [
	{ id: 'asociaciones', label: 'Asociaciones de ParticiParla' },
	{ id: 'tablones', label: 'Tablones de Libre Expresión' },
	{ id: 'teatros', label: 'Teatros' },
	{ id: 'bibliotecas', label: 'Bibliotecas' },
	{ id: 'espacios', label: 'Espacios asociativos' },
]

const activeLayers = ref<string[]>(layers.map(l => l.id))

function isLayerActive(id: string) {
	return activeLayers.value.includes(id)
}

function toggleLayer(id: string) {
	if (activeLayers.value.includes(id)) {
		activeLayers.value = activeLayers.value.filter((layerId: string) => layerId !== id)
	} else {
		activeLayers.value.push(id)
	}
}

function getEntityLayers(entity: Entity): string[] {
	const typologyToLayer: Record<string, string> = {
		asociacion: 'asociaciones',
		tablon: 'tablones',
		teatro: 'teatros',
		biblioteca: 'bibliotecas',
		espacio: 'espacios',
	}

	return [typologyToLayer[entity.typology || 'asociacion'] || 'asociaciones']
}

const filteredEntities = computed(() => {
	const q = searchQuery.value.trim().toLowerCase()
	const active = new Set(activeLayers.value)

	return entities.value.filter((entity: Entity) => {
		// Filtro por capas
		const entityLayers = getEntityLayers(entity)
		if (active.size && !entityLayers.some(layerId => active.has(layerId))) {
			return false
		}

		// Filtro por texto
		if (!q) return true

		const haystack = [
			entity.name,
			entity.objective,
			entity.description,
			entity.activities,
			entity.participate,
			entity.observations,
			entity.contact,
		]
			.filter(Boolean)
			.join(' ')
			.toLowerCase()

		return haystack.includes(q)
	})
})

// Lógica del Slideover movida aquí
const isModalOpen = ref(false)
const selectedEntity = ref<Entity | null>(null)

function handleMarkerClick(entity: Entity) {
	selectedEntity.value = entity;
	isModalOpen.value = true;
}

const listDetails = {
  "phone": {"text": "Teléfono", "icon": "material-symbols:call", "urlPrefix": "tel:"},
  "instagram": {"text": "Instagram", "icon": "mdi:instagram", "urlPrefix": "https://instagram.com/"},
  "facebook": {"text": "Facebook", "icon": "mdi:facebook-box", "urlPrefix": "https://facebook.com/"},
  "email": {"text": "Correo electrónico", "icon": "material-symbols:alternate-email", "urlPrefix": "mailto:"},
  "web": {"text": "Sitio web", "icon": "tabler:world-www", "urlPrefix": "https://"},
  "x": {"text": "Twitter", "icon": "hugeicons:new-twitter", "urlPrefix": "https://twitter.com/"}
}
//const listIcon = {"phone": "material-symbols:call", "instagram": "mdi:instagram", "facebook": "mdi:facebook-box", "email": "material-symbols:alternate-email", "web": "tabler:world-www", "x": "hugeicons:new-twitter"}
//const listContactType = {"phone": "Teléfono", "instagram": "Instagram", "facebook": "Facebook", "email": "Correo electrónico", "web": "Sitio web", "x": "Twitter"}

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
		const foundEntity = entities.value.find((e: Entity) => {
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
