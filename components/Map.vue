<template>
	<div id="map" class="h-full w-full">
		<LMap ref="map" :zoom="14" :center="startCoordiantes" :use-global-leaflet="true" @ready="onMapReady">
			<LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
				layer-type="base" name="OpenStreetMap" />
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
import LabeledMarker from 'leaflet-labeled-circle'
import 'leaflet-arrowheads';

LabeledMarker.include({

	_2PI: Math.PI * 2,
	_circleFootSeparation: 25, //related to circumference of circle
	_circleStartAngle: 0,

	_spiralFootSeparation: 28, //related to size of spiral (experiment!)
	_spiralLengthStart: 11,
	_spiralLengthFactor: 5,

	_circleSpiralSwitchover: 9, //show spiral instead of circle from this marker count upwards.
	// 0 -> always spiral; Infinity -> always circle

	spiderfy: function () {
		if (this._group._spiderfied === this || this._group._inZoomAnimation) {
			return;
		}

		var childMarkers = this.getAllChildMarkers(null, true),
			group = this._group,
			map = group._map,
			center = map.latLngToLayerPoint(this._latlng),
			positions;

		this._group._unspiderfy();
		this._group._spiderfied = this;

		//TODO Maybe: childMarkers order by distance to center

		if (this._group.options.spiderfyShapePositions) {
			positions = this._group.options.spiderfyShapePositions(childMarkers.length, center);
		} else if (childMarkers.length >= this._circleSpiralSwitchover) {
			positions = this._generatePointsSpiral(childMarkers.length, center);
		} else {
			center.y += 10; // Otherwise circles look wrong => hack for standard blue icon, renders differently for other icons.
			positions = this._generatePointsCircle(childMarkers.length, center);
		}

		this._animationSpiderfy(childMarkers, positions);
	},

	unspiderfy: function (zoomDetails) {
		/// <param Name="zoomDetails">Argument from zoomanim if being called in a zoom animation or null otherwise</param>
		if (this._group._inZoomAnimation) {
			return;
		}
		this._animationUnspiderfy(zoomDetails);

		this._group._spiderfied = null;
	},

	_generatePointsCircle: function (count, centerPt) {
		var circumference = this._group.options.spiderfyDistanceMultiplier * this._circleFootSeparation * (2 + count),
			legLength = circumference / this._2PI,  //radius from circumference
			angleStep = this._2PI / count,
			res = [],
			i, angle;

		legLength = Math.max(legLength, 35); // Minimum distance to get outside the cluster icon.

		res.length = count;

		for (i = 0; i < count; i++) { // Clockwise, like spiral.
			angle = this._circleStartAngle + i * angleStep;
			res[i] = new L.Point(centerPt.x + legLength * Math.cos(angle), centerPt.y + legLength * Math.sin(angle))._round();
		}

		return res;
	},

	_generatePointsSpiral: function (count, centerPt) {
		var spiderfyDistanceMultiplier = this._group.options.spiderfyDistanceMultiplier,
			legLength = spiderfyDistanceMultiplier * this._spiralLengthStart,
			separation = spiderfyDistanceMultiplier * this._spiralFootSeparation,
			lengthFactor = spiderfyDistanceMultiplier * this._spiralLengthFactor * this._2PI,
			angle = 0,
			res = [],
			i;

		res.length = count;

		// Higher index, closer position to cluster center.
		for (i = count; i >= 0; i--) {
			// Skip the first position, so that we are already farther from center and we avoid
			// being under the default cluster icon (especially important for Circle Markers).
			if (i < count) {
				res[i] = new L.Point(centerPt.x + legLength * Math.cos(angle), centerPt.y + legLength * Math.sin(angle))._round();
			}
			angle += separation / legLength + i * 0.0005;
			legLength += lengthFactor / angle;
		}
		return res;
	},

	_noanimationUnspiderfy: function () {
		var group = this._group,
			map = group._map,
			fg = group._featureGroup,
			childMarkers = this.getAllChildMarkers(null, true),
			m, i;

		group._ignoreMove = true;

		this.setOpacity(1);
		for (i = childMarkers.length - 1; i >= 0; i--) {
			m = childMarkers[i];

			fg.removeLayer(m);

			if (m._preSpiderfyLatlng) {
				m.setLatLng(m._preSpiderfyLatlng);
				delete m._preSpiderfyLatlng;
			}
			if (m.setZIndexOffset) {
				m.setZIndexOffset(0);
			}

			if (m._spiderLeg) {
				map.removeLayer(m._spiderLeg);
				delete m._spiderLeg;
			}
		}

		group.fire('unspiderfied', {
			cluster: this,
			markers: childMarkers
		});
		group._ignoreMove = false;
		group._spiderfied = null;
	}
});
let startCoordiantes = [40.237541, -3.772740]

let map = ref()


const onMapReady = () => {
	// Access the Leaflet map instance
	console.log(map.value.leafletObject)

	map.value.leafletObject.eachLayer(function (layer) {
		if (layer instanceof L.TileLayer) return
		map.value.leafletObject.removeLayer(layer);
	});


	let entitiesByHubs: Partial<Record<keyof typeof EntityHubsList, Entity[]>> = {}



	for (const entity of props.entities) {
		if (entity.coordinates == null) continue

		if (!Array.isArray(entity.coordinates)) {
			if (entitiesByHubs[entity.coordinates] === undefined) entitiesByHubs[entity.coordinates] = []

			entitiesByHubs[entity.coordinates].push(entity);

			continue
		}
		var marker = new LabeledMarker(
			entity.coordinates, {
			properties: {
				text: 1
			}
		}, {
			markerOptions: {
				color: 'black', fillColor: 'white', fillOpacity: 1, textStyle: {
					color: 'black',
					fontSize: 12,
					fontFamily: 'Helvetica, Arial, sans-serif',

				},
			}

		}).addTo(map.value.leafletObject);

	}


	for (const hubName in EntityHubsList) {
		let hub = EntityHubsList[hubName as keyof typeof EntityHubsList]

		L.polyline([hub.positionToShow!, hub.coordinates]).arrowheads().addTo(map.value.leafletObject);

		let entityInTheHub = entitiesByHubs[hubName as keyof typeof EntityHubsList]

		if (!entityInTheHub) continue

		let offset = 0.01
		for (const entity of entityInTheHub) {
			let marker = new LabeledMarker(
				hub.positionToShow, {
				properties: {
					text: 1
				}
			}, {
				markerOptions: {
					color: 'black', fillColor: 'white', fillOpacity: 1, textStyle: {
						color: 'black',
						fontSize: 12,
						fontFamily: 'Helvetica, Arial, sans-serif',

					},
				}

			}).addTo(map.value.leafletObject);


		}



	}

	map.value.leafletObject.setView(startCoordiantes, 14);


}



</script>

<style scoped></style>
