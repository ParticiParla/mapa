<template>
	<div class="entity-list m-5"
		:class="{ 'grid grid-cols-3 padding-only-start ml--4': horizontal, 'flex flex-wrap justify-between flex-col': !horizontal }">
		<div v-for="(entity, index) in entitiesWithQr" :key="entity.name"
			class="flex flex-row justify-between entity items-center">
			<NuxtImg provider="directus" width="50" height="50" fit="outside" class="w-22.33 h-22.33"
				:src="entity.logo || 'https://placehold.co/50x50'">
			</NuxtImg>
			<div class="flex-grow m-x-2 flex justify-start h-full flex-col">
				<div>{{ startNumber + index }}</div>

				<div class="text-4.5">{{ entity.name }}</div>
				<div>{{ entity.objective }}</div>
			</div>
			<div v-html="entity.qr" class="qr"></div>
		</div>
		<div class="entity !h-0" v-if="showLastLine"></div>
		<!-- <div v-if="entityParticiParla" class="flex flex-col justify-around entity items-center participarla-entity">
			<NuxtImg provider="directus" width="100" height="100" fit="outside" class="w-44.64 h-44.64"
				:src="entityParticiParla.logo || 'https://placehold.co/50x50'">
			</NuxtImg>

			<div class="text-center">{{ entityParticiParla.objective }}</div>
		</div> -->
		<div v-if="entityParticiParla" class="flex flex-col justify-around entity items-center participarla-entity">
			<!-- <NuxtImg provider="directus" width="100" height="100" fit="outside" class="w-44.64 h-44.64"
				:src="entityParticiParla.logo || 'https://placehold.co/50x50'">
			</NuxtImg> -->
			<div v-html="qrMainPage" class="w-44.64 h-44.64"></div>

			<div class="text-center">Mira el mapa actualizado y contacta con las asociaciones en tu móvil!</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import {
	renderSVG,
} from 'uqr'
import { useRequestURL } from '#imports';

let props = withDefaults(defineProps<{
	entities: EntityList,
	startNumber?: number
	horizontal?: boolean
	showLastLine?: boolean
}>(), {
	startNumber: 1,
	showLastLine: false
})

// Obtener la URL base
const requestUrl = useRequestURL();
const baseUrl = requestUrl.origin;

let qrMainPage = computed(() => {

	return renderSVG(`${baseUrl}`, {})
});

let entityParticiParla = props.entities.find(a => a.name === "ParticiParla")

let entitiesWithQr = computed(() => {
	return props.entities.filter(a => a.name !== "ParticiParla").map(entity => {
		// Construir la URL completa para el QR
		const path = entity.id ? `/?entity=${entity.id}` : undefined;
		const fullQrUrl = path ? `${baseUrl}${path}` : undefined;
		return {
			...entity,
			qr: fullQrUrl ? renderSVG(fullQrUrl, {}) : undefined
		}
	})
})
</script>

<style scoped>
.participarla-entity {
	grid-column-start: 3;
	/* grid-row-start: 1; */
	grid-row: 1 / 3;
}

.qr,
.qr svg {
	height: 5.5825rem !important;
	width: 5.5825rem !important;
	min-width: 5.5825rem !important;
	min-height: 5.5825rem !important;


}

.padding-only-start {
	padding-left: 2rem;
	--line-offset-start: 0.625rem !important;
	--line-offset-end: 0.625rem !important;
}

.entity-list {

	/* Locally scoped variables */
	--gap: 2rem;
	--line-offset: calc(var(--gap) / 2);
	--line-thickness: 0.0625rem;
	--line-color: rgb(114, 114, 114);
	--line-offset-start: 1.25rem;
	--line-offset-end: 1.25rem;

	/* Grid layout (Can be anything) */
	display: grid;
	/* grid-template-columns: repeat(3, minmax(0, 1fr)); */
	overflow: hidden;
	gap: var(--gap);
}

.entity-list:has(.participarla-entity) {
	grid-template-columns: 1fr 1fr 0.6fr;
}

/* Make Grid Items Control Absolute Pseudo Positioning */
.entity {
	position: relative;
}

/* Pseudo Element Shared Styling */
.entity::before,
.entity::after {
	content: '';
	position: absolute;
	background-color: var(--line-color);
	z-index: 1;



}

/* Row Borders */
.entity::after {

	inline-size: calc(100% - (var(--line-offset-start) + var(--line-offset-end)));
	block-size: var(--line-thickness);
	left: 3.125rem;
	inset-inline-start: 0;
	margin-left: var(--line-offset-start);
	margin-right: var(--line-offset-end);
	inset-block-start: calc(var(--line-offset) * -1);
}

/* Column Borders */
.entity::before {
	inline-size: var(--line-thickness);
	block-size: calc(100% - (var(--line-offset-start) + var(--line-offset-end)));
	margin-top: var(--line-offset-start);
	margin-bottom: var(--line-offset-start);
	inset-inline-start: calc(var(--line-offset) * -1);
}
</style>
