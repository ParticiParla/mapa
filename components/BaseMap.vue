<template>
	<div id="map" class="h-full w-full relative z-10">
		<LMap ref="map" :zoom="14" :center="[startCoordiantes[0], startCoordiantes[1]]" :use-global-leaflet="true"
			@ready="onMapReady">
			<LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base"
				name="OpenStreetMap" />
		</LMap>
	</div>
</template>

<script lang="ts" setup>
import type { Entity, Hub, EntityList } from '~/utils/types';
import L, { type LatLngExpression, type Layer, type LatLngTuple } from 'leaflet';
import 'leaflet-arrowheads';

// Define props
const props = withDefaults(defineProps<{
	entities: EntityList,
	hubs: Record<string, Hub[]>,
	markerType?: 'index' | 'logo',
	interactive?: boolean
}>(), {
	markerType: 'index',
	interactive: false
})

// Define emits
const emit = defineEmits<{
	(e: 'marker-click', entity: Entity): void
}>()

let startCoordiantes: LatLngTuple = [40.237541, -3.765740];
let map = ref()

const onMapReady = () => {
	const leafletMap = map.value.leafletObject as L.Map;

	if (leafletMap.zoomControl) leafletMap.removeControl(leafletMap.zoomControl);
	if (leafletMap.attributionControl) leafletMap.removeControl(leafletMap.attributionControl);

	// Limpiar capas existentes excepto TileLayer
	const layersToRemove: Layer[] = [];
	leafletMap.eachLayer((layer: Layer) => {
		if (!(layer instanceof L.TileLayer)) {
			layersToRemove.push(layer);
		}
	});
	layersToRemove.forEach(layer => leafletMap.removeLayer(layer));


	let entitiesByHubs: Partial<Record<keyof typeof props.hubs, [string, Entity][]>> = {}

	for (const entityIndex in props.entities) {
		const entity = props.entities[entityIndex]

		if (!Array.isArray(entity.coordinates)) {
			if (entity.hub === undefined) continue
			if (entitiesByHubs[entity.hub!] === undefined) entitiesByHubs[entity.hub!] = []
			// Almacenar índice global junto con la entidad
			entitiesByHubs[entity.hub!]!.push([entityIndex, entity]);
			continue
		}

		const coords: LatLngExpression = [entity.coordinates[0], entity.coordinates[1]];

		generateMarker(coords, entity, Number(entityIndex) + 1).addTo(leafletMap);
	}

	for (const hubName in props.hubs) {
		let hub = props.hubs[hubName as keyof typeof props.hubs][0]
		const hubCoords: LatLngExpression = [hub.coordinates.coordinates[0], hub.coordinates.coordinates[1]];
		const hubPointToShowCoords: LatLngExpression = [hub.pointToShow.coordinates[0], hub.pointToShow.coordinates[1]];

		L
			.polyline([hubPointToShowCoords, hubCoords], { color: 'black' })
			.arrowheads({}) // Asegurarse que arrowheads es llamado
			.addTo(leafletMap);

		let entityInTheHub = entitiesByHubs[hubName as keyof typeof props.hubs]

		if (!entityInTheHub) continue

		const hubPointToShowLayerPoint = leafletMap.latLngToLayerPoint(hubPointToShowCoords);

		let points = _generatePointsCircle(entityInTheHub.length, hubPointToShowLayerPoint, hub.startOfCoordinates);
		for (const entityData of entityInTheHub) {
			const [entityIndex, entity] = entityData; // Usar el índice global almacenado
			let entityPoints = points.shift()

			if (!entityPoints) continue;

			entityPoints.y += hub.verticalPosition! || 0
			entityPoints.x += hub.horizontalPosition! || 0
			generateMarker(leafletMap.layerPointToLatLng(entityPoints), entity, Number(entityIndex) + 1)
				.addTo(leafletMap);
		}
	}

	leafletMap.setView(startCoordiantes, 14);
}

// Modificado para aceptar índice y usar props
function generateMarker(coordinates: LatLngExpression, entity: Entity, index: number) {
	let iconHtml: string;
	if (props.markerType === 'logo' && entity.logoLink) {
		iconHtml = `<img src="${entity.logoLink}" alt="${entity.name || 'logo'}" class="!w-full !h-full !object-contain !rounded-full">`;
	} else {
		// Usar el índice global pasado como argumento
		iconHtml = `<div>${index}</div>`;
	}

	const marker = new L.Marker(
		coordinates, {
		icon: L.divIcon({
			html: iconHtml,
			// Añadido cursor-pointer solo si es interactivo
			className: `bg-white border-2 border-solid border-black border rounded-full w-full h-full text-4.5 text-center flex justify-center items-center ${props.interactive ? 'cursor-pointer hover:bg-gray-200' : ''}`,
			iconSize: [25, 25]
		})
	});

	// Añadir listener solo si es interactivo
	if (props.interactive) {
		marker.on('click', () => {
			emit('marker-click', entity);
		});
	}

	return marker;
}


function _generatePointsCircle(count: number, centerPt: L.Point, startAngle = 0): L.Point[] {
	let minDistace = 20
	let _circleStartAngle = startAngle

	let _circleFootSeparation = 25
	let _2PI = Math.PI * 2
	let spiderfyDistanceMultiplier = 1
	var circumference = spiderfyDistanceMultiplier * _circleFootSeparation * (2 + count),
		legLength = circumference / _2PI,
		angleStep = _2PI / count,
		res: L.Point[] = [],
		i, angle;

	legLength = Math.max(legLength, minDistace);

	res.length = count;

	for (i = 0; i < count; i++) {
		angle = _circleStartAngle + i * angleStep;
		res[i] = L.point(centerPt.x + legLength * Math.cos(angle), centerPt.y + legLength * Math.sin(angle)).round();
	}

	return res;
}

// Asegurarse de que onMapReady se llama cuando el componente está montado y el mapa está listo
// onMounted(() => {
// Se llama automáticamente por el @ready del componente LMap
// });

</script>

<style scoped></style>
