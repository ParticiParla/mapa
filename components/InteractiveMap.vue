<template>
	<div id="map" class="h-full w-full relative z-10">
		<LMap ref="map" :zoom="14" :center="startCoordiantes" :use-global-leaflet="true" @ready="onMapReady">
			<LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base"
				name="OpenStreetMap" />
			<!-- <LCircleMarker
    :lat-lng="[40.239929, -3.761392]"
    :radius="6"
    :color="'black'"
    fillColor="white"
    fillOpacity="1"
  >
  </LCircleMarker> -->
		</LMap>
	</div>
	<ClientOnly>
		<USlideover v-model:open="isModalOpen" :prevent-close="false">

			<template #header>
				<div class="flex items-center justify-between w-full">
					<div class="flex items-center gap-4">
						<NuxtImg v-if="selectedEntity?.logoLink" :src="selectedEntity.logoLink"
							class="h-8 w-8 object-contain" />
						<h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
							{{ selectedEntity?.name }}
						</h3>
					</div>
					<UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
						@click="isModalOpen = false" />
				</div>
			</template>
			<template #body>
				<div class="p-4 space-y-6 flex-1 overflow-y-auto h-full">
					<!-- Logo moved to header -->
					<div>
						<h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">Descripción</h4>
						<p class="text-sm text-gray-500 dark:text-gray-400">
							{{ selectedEntity?.objective }}
						</p>
					</div>
					<div>
						<h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">Documento</h4>
						<template v-if="selectedEntity?.pdfLink">
							<iframe :src="selectedEntity.pdfLink" width="100%" height="300px"
								style="border: none;"></iframe>
							<UButton :to="selectedEntity.pdfLink" target="_blank" label="Abrir PDF en nueva pestaña"
								icon="i-heroicons-arrow-top-right-on-square" variant="link" :padded="false" />
						</template>
						<p v-else class="text-sm text-gray-500 dark:text-gray-400 text-center">No hay PDF disponible.
						</p>
					</div>

				</div>
			</template>
		</USlideover>
	</ClientOnly>
</template>

<script lang="ts" setup>
import type { Entity, Hub, EntityList } from '~/utils/types';
import L, { type LatLngExpression, type PointExpression, type Layer } from 'leaflet';
import 'leaflet-arrowheads'; // Restaurada la importación

// // Tipos para leaflet-arrowheads (si no existen en @types/leaflet) - Eliminado por completo
// declare module 'leaflet' {
// 	interface Polyline {
// 		arrowheads(options?: any): this;
// 	}
// }

let props = defineProps<{
	entities: EntityList,
	hubs: Record<string, Hub[]>
}>()

let startCoordiantes: LatLngExpression = [40.237541, -3.765740]

let map = ref()
const isModalOpen = ref(false)
const selectedEntity = ref<Entity | null>(null)


const onMapReady = () => {
	// Access the Leaflet map instance
	const leafletMap = map.value.leafletObject as L.Map;

	if (leafletMap.zoomControl) leafletMap.removeControl(leafletMap.zoomControl);
	if (leafletMap.attributionControl) leafletMap.removeControl(leafletMap.attributionControl);

	leafletMap.eachLayer(function (layer: Layer) { // Añadir tipo explícito
		if (layer instanceof L.TileLayer) return
		leafletMap.removeLayer(layer);
	});


	let entitiesByHubs: Partial<Record<keyof typeof props.hubs, [number, Entity][]>> = {}


	let counter = 0
	for (const entity of props.entities) {
		counter++;

		if (!Array.isArray(entity.coordinates)) {
			if (entitiesByHubs[entity.hub!] === undefined) entitiesByHubs[entity.hub!] = []

			entitiesByHubs[entity.hub!]!.push([counter, entity]);

			continue
		}
		// Asegurarse que las coordenadas son LatLngExpression
		const coords: LatLngExpression = [entity.coordinates[0], entity.coordinates[1]];
		generateMarker(coords, entity).addTo(leafletMap);

	}

	for (const hubName in props.hubs) {
		let hub = props.hubs[hubName as keyof typeof props.hubs][0]
		const hubCoords: LatLngExpression = [hub.coordinates.coordinates[0], hub.coordinates.coordinates[1]];
		const hubPointToShowCoords: LatLngExpression = [hub.pointToShow.coordinates[0], hub.pointToShow.coordinates[1]];

		L
			.polyline([hubPointToShowCoords, hubCoords], { color: 'black' })
			.arrowheads({})
			.addTo(leafletMap);

		let entityInTheHub = entitiesByHubs[hubName as keyof typeof props.hubs]

		if (!entityInTheHub) continue

		const hubPointToShowLayerPoint = leafletMap.latLngToLayerPoint(hubPointToShowCoords);

		let points = _generatePointsCircle(entityInTheHub.length, hubPointToShowLayerPoint, hub.startOfCoordinates);
		for (const entityData of entityInTheHub) {
			const [entityIndex, entity] = entityData;
			let entityPoints = points.shift()

			if (!entityPoints) continue; // Seguridad por si points.shift() devuelve undefined

			entityPoints.y += hub.verticalPosition! || 0
			entityPoints.x += hub.horizontalPosition! || 0
			generateMarker(leafletMap.layerPointToLatLng(entityPoints), entity)
				.addTo(leafletMap);
		}
	}

	leafletMap.setView(startCoordiantes, 14);
}

function generateMarker(coordinates: LatLngExpression, entity: Entity) {
	let iconHtml: string;
	if (entity.logoLink) {
		iconHtml = `<img src="${entity.logoLink}" alt="${entity.name || 'logo'}" class="w-full h-full object-contain rounded-full">`;
	} else {
		const index = props.entities.findIndex((e: Entity) => e === entity);
		iconHtml = `<div>${index + 1}</div>`;
	}

	const marker = new L.Marker(
		coordinates, {
		icon: L.divIcon({
			html: iconHtml,
			className: 'bg-white border-2 border-solid border-black rounded-full w-[25px] h-[25px] text-sm text-center flex justify-center items-center cursor-pointer hover:bg-gray-200 overflow-hidden',
			iconSize: [25, 25]
		})
	});

	marker.on('click', () => {
		console.log('Clicked on:', entity.name, entity);
		selectedEntity.value = entity;
		isModalOpen.value = true;
	});

	return marker;
}

function _generatePointsCircle(count: number, centerPt: L.Point, startAngle = 0): L.Point[] { // Añadir tipo de retorno
	let minDistace = 20
	let _circleStartAngle = startAngle

	let _circleFootSeparation = 25
	let _2PI = Math.PI * 2
	let spiderfyDistanceMultiplier = 1
	var circumference = spiderfyDistanceMultiplier * _circleFootSeparation * (2 + count),
		legLength = circumference / _2PI,  //radius from circumference
		angleStep = _2PI / count,
		res: L.Point[] = [], // Inicializar con el tipo correcto
		i, angle;

	legLength = Math.max(legLength, minDistace); // Minimum distance to get outside the cluster icon.

	res.length = count;

	for (i = 0; i < count; i++) { // Clockwise, like spiral.
		angle = _circleStartAngle + i * angleStep;
		// Usar L.point para crear el punto y llamar a round() que sí existe
		res[i] = L.point(centerPt.x + legLength * Math.cos(angle), centerPt.y + legLength * Math.sin(angle)).round();
	}

	return res;
}


</script>

<style scoped></style>
