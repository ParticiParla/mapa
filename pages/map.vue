<template>
	<div class="container">
		<NuxtRouteAnnouncer />
		<EntityList :entities="entities.slice(0, splitNumber)" class="vertical-list"></EntityList>
		<EntityList :entities="entities.slice(splitNumber, splitNumber2)" :start-number="splitNumber + 1"
			class="vertical-list2" show-last-line></EntityList>
		<EntityList :entities="entities.slice(splitNumber2)" :start-number="splitNumber2 + 1" horizontal
			class="horizontal-list"></EntityList>

		<div class="map">
			<div class="relative">
				<div class="text-20 absolute z-50 bg-white w-full">CONOCE #PARTICIPARLA</div>
			</div>

			<Map :entities="entities" :hubs="hubs"></Map>


		</div>

	</div>
</template>

<script lang="ts" setup>
// import csvToJson from 'csvjson-csv2json';

let splitNumber = 9
let splitNumber2 = splitNumber + 7

// let fileInputName = 'myInputFile.csv';
// let fileOutputName = 'myOutputFile.json';

// let rawEntities = csvToJson(await (await fetch('fichas.csv')).text())

// let entities = rawEntities.map(entity => {
//   let values = Object.values(entity)
//   console.log(Object.entries(entity));
//   return {
//     time: values[0],
//     name: values[1],
//     objective: values[2],
//     activities: values[3],
//     howToParticipate: values[4],
//     schedule: values[5],
//     location: values[6],
//     contact: values[7],
//     observations: values[8],
//   }

// })
// console.log(entities);
let { entities, hubs } = await $fetch('/api/entities')
console.log(entities);
</script>

<style>
.container {
	height: 100%;
	width: 100%;
	max-width: unset;
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr;
	grid-template-rows: 1fr 1fr 1fr 1fr;
	gap: 0px 0px;
	/* grid-auto-flow: row; */
	grid-template-areas:
		"vertical-list vertical-list2 map map"
		"vertical-list vertical-list2 map map"
		"vertical-list vertical-list2 map map"
		"vertical-list horizontal-list horizontal-list horizontal-list";

}

.map {
	grid-area: map;
}

.vertical-list {
	grid-area: vertical-list;
}

.vertical-list2 {
	grid-area: vertical-list2;
}

.horizontal-list {
	grid-area: horizontal-list;
}

#__nuxt {
	height: 100%;
	width: 100%;
}

:root {
	--a3-width: 420mm;
	--a3-height: 297mm;
	--a3-font-size: 16px;

	--a4-width: 297mm;
	--a4-height: 210mm;
	--a4-font-size: 16px;


	--page-size-width: var(--a4-width);
	--page-size-height: var(--a4-height);
	--page-font-size: var(--a4-font-size);

	/* font-size: var(--page-font-size); */
}

html {
	width: var(--page-size-width);
	height: var(--page-size-height);

	background-color: black;
	margin: 0;
	padding: 0;
	font-size: 9px;
	font-family: 'Inter';
}

body {
	background-color: white;
	height: 100%;
	width: 100%;
	margin: 0;
	padding: 0;
}

@page {
	size: A4 landscape;
	margin: 0;
}

@media print {

	html,
	body {
		/* width: 297mm;
		height: 210mm; */

		width: var(--page-size-width);
		height: var(--page-size-height);
	}

	/* ... the rest of the rules ... */
}
</style>
