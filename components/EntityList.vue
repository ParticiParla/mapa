<template>
	<div class="" :class="{ 'grid grid-cols-3': horizontal, 'flex flex-wrap justify-between flex-col': !horizontal }">
		<div v-for="entity in entitiesWithQr" :key="entity.name" class="flex flex-row justify-between">
			<NuxtImg class="w-50px h-50px" src="https://placehold.co/50x50"></NuxtImg>
			<div>
				<div class="text-10px">{{ entity.name }}</div>
				<div>{{ entity.objective.slice(0, 100) }}</div>
			</div>
			<div v-html="entity.qr" class="qr"></div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import {
	renderSVG,
} from 'uqr'

let props = defineProps<{
	entities: EntityList
	horizontal?: boolean
}>()

let entitiesWithQr = computed(() => {
	return props.entities.map(entity => {
		return {
			...entity,
			qr: renderSVG(entity.contact, {})
		}
	})
})
</script>

<style scoped>
.qr,
.qr svg {
	height: 50px !important;
	width: 50px !important;


}
</style>
