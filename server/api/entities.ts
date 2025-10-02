import { EntityList, Entity, Hub } from "~/utils/types"
import { createDirectus, rest, readItems, staticToken } from '@directus/sdk';
import { useRuntimeConfig } from '#imports';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const directusUrl = config.directusUrl;
	const directusToken = config.directusToken;

	if (!directusUrl) {
		throw createError({
			statusCode: 500,
			statusMessage: 'Directus URL no configurada en runtimeConfig',
		});
	}

	const client = createDirectus(directusUrl).with(rest());

	try {
		const entities = await client.request(readItems('Entity', {
			fields: ['id', 'name', 'objetive', 'logo', 'coordinates', 'file', 'hub', 'description', 'schedule', 'activities', 'participate', 'observations', 'contact'],
			filter: {
				status: "Published"
			}
		}));

		let hubs = await client.request<Hub[]>(readItems('Hub', {
			fields: ['id', 'name', 'horizontalPosition', 'verticalPosition', 'startOfCoordinates', 'pointToShow', 'coordinates']
		}));

		hubs = hubs.map((item: Hub): Hub => {
			return {
				...item,
				coordinates: { coordinates: item.coordinates.coordinates.reverse() },
				pointToShow: { coordinates: item.pointToShow.coordinates.reverse() },
			}
		}).filter(hub => entities.some(entity => entity.hub === hub.id))

		const response: EntityList = entities.map((item: any): Entity => {
			return {
				id: item.id,
				name: item.name,
				objective: item.objetive,
				logo: item.logo,
				logoLink: item.logo ? `${directusUrl}/assets/${item.logo}` : item.logoLink,
				pdfLink: item.file ? `${directusUrl}/assets/${item.file}` : item.pdfLink,
				coordinates: item.hub ? item.coordinates?.coordinates.reverse() : item.coordinates?.coordinates.reverse(),
				hub: item.hub,
				description: item.description,
				schedule: item.schedule,
				activities: item.activities,
				participate: item.participate,
				observations: item.observations,
				contact: item.contact
			};
		});

		return { entities: response, hubs: Object.groupBy(hubs, a => a.id) };

	} catch (error: any) {
		console.error("Error al obtener entidades desde Directus:", error);
		throw createError({
			statusCode: error.response?.status || 500,
			statusMessage: 'Error al contactar con Directus',
			data: error.errors || error.message,
		});
	}
})
