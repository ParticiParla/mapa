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
import { getCurrentInstance, h, ref, render, watch } from 'vue'
import { Icon } from '#components'
import type { Entity, Hub, EntityList } from '~/utils/types';
import L, { type LatLngExpression, type LatLngTuple } from 'leaflet';
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
	(e: 'visible-change', entities: Entity[]): void
}>()

let startCoordiantes: LatLngTuple = [40.237541, -3.765740];
let map = ref()
const entityMarkers = new Map<number, L.Marker>()
const hubLineLayers = new Map<number, L.Polyline>()

type DesiredMarker = {
	entity: Entity,
	coordinates: LatLngExpression,
	index: number,
	hubId?: number,
}

function updateVisibleEntities(leafletMap: L.Map) {
	const bounds = leafletMap.getBounds();
	const collected = new Map<number, Entity>();

	for (const marker of entityMarkers.values()) {
		const latlng = marker.getLatLng();
		if (!bounds.contains(latlng)) continue

		const anyLayer = marker as any;
		const entity: Entity | undefined = anyLayer.__entity;
		if (entity && !collected.has(entity.id)) {
			collected.set(entity.id, entity);
		}
	}

	emit('visible-change', Array.from(collected.values()));
}

function updateHubLines(leafletMap: L.Map) {
	const bounds = leafletMap.getBounds();
	const visibleHubIds = new Set<number>();

	for (const marker of entityMarkers.values()) {
		const anyLayer = marker as any;
		const hubId: number | undefined = anyLayer.__hubId;
		if (!hubId) continue
		if (bounds.contains(marker.getLatLng())) {
			visibleHubIds.add(hubId);
		}
	}

	for (const [hubId, lineLayer] of hubLineLayers.entries()) {
		if (visibleHubIds.has(hubId)) continue
		leafletMap.removeLayer(lineLayer)
		hubLineLayers.delete(hubId)
	}

	for (const hubName in props.hubs) {
		const hub = props.hubs[hubName as keyof typeof props.hubs][0]
		if (!visibleHubIds.has(hub.id)) continue
		if (hubLineLayers.has(hub.id)) continue

		const hubCoords: LatLngExpression = [hub.coordinates.coordinates[0], hub.coordinates.coordinates[1]];
		const hubPointToShowCoords: LatLngExpression = [hub.pointToShow.coordinates[0], hub.pointToShow.coordinates[1]];

		const hubLine = L
			.polyline([hubPointToShowCoords, hubCoords], { color: 'black' })
			.arrowheads({})
			.addTo(leafletMap);

		hubLineLayers.set(hub.id, hubLine);
	}
}

function getMarkerSignature(entity: Entity, coordinates: LatLngExpression, index: number, hubId?: number) {
	const latLng = Array.isArray(coordinates)
		? L.latLng(coordinates[0], coordinates[1])
		: L.latLng(coordinates)
	const { lat, lng } = latLng
	return JSON.stringify({
		lat,
		lng,
		index,
		hubId,
		markerType: props.markerType,
		interactive: props.interactive,
		logoLink: entity.logoLink ?? null,
		typology: entity.typology ?? null,
	})
}

function syncMarker(leafletMap: L.Map, desiredMarker: DesiredMarker) {
	const existingMarker = entityMarkers.get(desiredMarker.entity.id)
	const nextSignature = getMarkerSignature(
		desiredMarker.entity,
		desiredMarker.coordinates,
		desiredMarker.index,
		desiredMarker.hubId,
	)

	if (existingMarker) {
		const currentSignature = (existingMarker as any).__signature as string | undefined
		if (currentSignature === nextSignature) {
			;(existingMarker as any).__entity = desiredMarker.entity
			;(existingMarker as any).__hubId = desiredMarker.hubId
			if (!leafletMap.hasLayer(existingMarker)) {
				existingMarker.addTo(leafletMap)
			}
			return
		}

		leafletMap.removeLayer(existingMarker)
		entityMarkers.delete(desiredMarker.entity.id)
	}

	const marker = generateMarker(desiredMarker.coordinates, desiredMarker.entity, desiredMarker.index)
	;(marker as any).__hubId = desiredMarker.hubId
	;(marker as any).__signature = nextSignature
	marker.addTo(leafletMap)
	entityMarkers.set(desiredMarker.entity.id, marker)
}

function renderLayers(leafletMap: L.Map) {
	let entitiesByHubs: Partial<Record<keyof typeof props.hubs, [string, Entity][]>> = {}
	const desiredMarkers = new Map<number, DesiredMarker>()

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

		desiredMarkers.set(entity.id, {
			entity,
			coordinates: coords,
			index: Number(entityIndex) + 1,
		})
	}

	for (const hubName in props.hubs) {
		let hub = props.hubs[hubName as keyof typeof props.hubs][0]
		const hubPointToShowCoords: LatLngExpression = [hub.pointToShow.coordinates[0], hub.pointToShow.coordinates[1]];

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
			const markerLatLng = leafletMap.layerPointToLatLng(entityPoints)
			desiredMarkers.set(entity.id, {
				entity,
				coordinates: markerLatLng,
				index: Number(entityIndex) + 1,
				hubId: hub.id,
			})
		}
	}

	for (const [entityId, marker] of entityMarkers.entries()) {
		if (desiredMarkers.has(entityId)) continue
		leafletMap.removeLayer(marker)
		entityMarkers.delete(entityId)
	}

	for (const desiredMarker of desiredMarkers.values()) {
		syncMarker(leafletMap, desiredMarker)
	}

	updateHubLines(leafletMap);
	updateVisibleEntities(leafletMap);
}

const onMapReady = () => {
	const leafletMap = map.value.leafletObject as L.Map;

	if (leafletMap.zoomControl) leafletMap.removeControl(leafletMap.zoomControl);
	if (leafletMap.attributionControl) leafletMap.removeControl(leafletMap.attributionControl);

	leafletMap.setView(startCoordiantes, 14);

	// Render inicial
	renderLayers(leafletMap);

	// Actualizar lista visible al mover/zoom
	leafletMap.on('moveend zoomend', () => {
		updateHubLines(leafletMap);
		updateVisibleEntities(leafletMap);
	});
}

watch(() => [props.entities, props.hubs], () => {
	const leafletMap = map.value?.leafletObject as L.Map | undefined;
	if (leafletMap) {
		renderLayers(leafletMap);
	}
}, { deep: true })

const typologyIcons: Record<string, string> = {
	tablon: 'mdi:bullhorn-outline',
	teatro: 'mdi:theater',
	biblioteca: 'material-symbols:menu-book-outline-rounded',
	espacio: 'mdi:office-building-outline',
}

const renderedIconCache = new Map<string, string>()
const appContext = getCurrentInstance()?.appContext ?? null

function renderNuxtIconToHtml(name: string) {
	const cachedIcon = renderedIconCache.get(name)
	if (cachedIcon) return cachedIcon

	const container = document.createElement('div')
	const vnode = h(Icon, { name, class: 'size-4 text-black' })
	vnode.appContext = appContext
	render(vnode, container)
	const iconHtml = container.innerHTML
	render(null, container)
	renderedIconCache.set(name, iconHtml)

	return iconHtml
}

function getMarkerContent(entity: Entity, index: number) {
	if (entity.typology && entity.typology !== 'asociacion') {
		const iconName = typologyIcons[entity.typology]
		return iconName ? renderNuxtIconToHtml(iconName) : `<div>${index}</div>`;
	}

	if (props.markerType === 'logo' && entity.logoLink) {
		return `<img src="${entity.logoLink}?width=21&height=21" alt="${entity.name || 'logo'}" class="!w-full !h-full !object-contain !rounded-full">`;
	}

	return `<div>${index}</div>`;
}

// Modificado para aceptar índice y usar props
function generateMarker(coordinates: LatLngExpression, entity: Entity, index: number) {
	const iconHtml = getMarkerContent(entity, index);

	const marker = new L.Marker(
		coordinates, {
		icon: L.divIcon({
			html: iconHtml,
			// Añadido cursor-pointer solo si es interactivo
			className: `bg-white border-2 border-solid border-black border rounded-full w-full h-full text-4.5 text-center flex justify-center items-center ${props.interactive ? 'cursor-pointer hover:bg-gray-200' : ''}`,
			iconSize: [25, 25]
		})
	});

	// Guardar la entidad en el marker para poder saber qué puntos están visibles
	;(marker as any).__entity = entity;

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
