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
</template>

<script lang="ts" setup>
let props = defineProps<{
	entities: EntityList
}>()
import L from 'leaflet';
import 'leaflet-arrowheads';

let startCoordiantes = [40.237541, -3.765740]

let map = ref()


const onMapReady = () => {
	// Access the Leaflet map instance

	if (map.value.leafletObject.zoomControl) map.value.leafletObject.removeControl(map.value.leafletObject.zoomControl);
	if (map.value.leafletObject.attributionControl) map.value.leafletObject.removeControl(map.value.leafletObject.attributionControl);

	map.value.leafletObject.eachLayer(function (layer) {
		if (layer instanceof L.TileLayer) return
		map.value.leafletObject.removeLayer(layer);
	});


	let entitiesByHubs: Partial<Record<keyof typeof EntityHubsList, [number, Entity][]>> = {}


	let counter = 0
	for (const entity of props.entities) {
		counter++;
		if (entity.coordinates == null) continue

		if (!Array.isArray(entity.coordinates)) {
			if (entitiesByHubs[entity.coordinates] === undefined) entitiesByHubs[entity.coordinates] = []

			entitiesByHubs[entity.coordinates]!.push([counter, entity]);

			continue
		}

		generateMarker(entity.coordinates, counter).addTo(map.value.leafletObject);

	}


	for (const hubName in EntityHubsList) {
		let hub = EntityHubsList[hubName as keyof typeof EntityHubsList]

		L
			.polyline([hub.positionToShow!, hub.coordinates], { color: 'black' })
			.arrowheads()
			.addTo(map.value.leafletObject);

		let entityInTheHub = entitiesByHubs[hubName as keyof typeof EntityHubsList]

		if (!entityInTheHub) continue

		let points = _generatePointsCircle(entityInTheHub.length, map.value.leafletObject.latLngToLayerPoint(hub.positionToShow), hub.startOfCoordinates);
		for (const entity of entityInTheHub) {
			let entityPoints = points.shift()
			console.log(entityPoints);
			entityPoints.y += hub.verticalPosition! || 0
			entityPoints.x += hub.horizontalPosition! || 0
			generateMarker(map.value.leafletObject.layerPointToLatLng(entityPoints), entity[0])
				.addTo(map.value.leafletObject);


		}

	}

	map.value.leafletObject.setView(startCoordiantes, 14);


}

function generateMarker(coordinates: number[], text: number) {
	return new L.Marker(
		coordinates, {
		icon: L.divIcon({
			html: `<div>${text}</div>`,
			className: 'bg-white border-2 border-solid border-black border rounded-full w-full h-full text-10px text-center flex justify-center items-center',
			iconSize: [25, 25]
		})
	})
}

function _generatePointsCircle(count: number, centerPt: L.Point, startAngle = 0) {
	let minDistace = 20
	let _circleStartAngle = startAngle

	let _circleFootSeparation = 25
	let _2PI = Math.PI * 2
	let spiderfyDistanceMultiplier = 1
	var circumference = spiderfyDistanceMultiplier * _circleFootSeparation * (2 + count),
		legLength = circumference / _2PI,  //radius from circumference
		angleStep = _2PI / count,
		res = [],
		i, angle;

	legLength = Math.max(legLength, minDistace); // Minimum distance to get outside the cluster icon.

	res.length = count;

	for (i = 0; i < count; i++) { // Clockwise, like spiral.
		angle = _circleStartAngle + i * angleStep;
		res[i] = new L.Point(centerPt.x + legLength * Math.cos(angle), centerPt.y + legLength * Math.sin(angle))._round();
	}

	return res;
}


</script>

<style scoped></style>
