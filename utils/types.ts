export interface Entity {
	name: string,
	objective: string,
	activities: string,
	howToParticipate: string,
	schedule: string,
	location: string,
	coordinates: number[] | EntityHubs | null,
	contact: string,
	observations: string,
}

export const EntityHubsList = {
	momo: {
		name: "Momo",
		coordinates: [40.2418433240197, -3.7749668485938326],
		positionToShow: [40.241774832501676, -3.7851419541709324]

	},
	toros: {
		name: "Plaza de Toros",
		coordinates: [40.24409836145415, -3.7579713273575486],
		positionToShow: [40.24565101545685, -3.760452981944479]
	},
	vicente: {
		name: "Edificio Asociativo Vicente Aleixandre",
		coordinates: [40.243438842584354, -3.7658926536887534],
		positionToShow: [40.24842185044188, -3.7630888247399477]
	},
}

export type EntityHubs = keyof typeof EntityHubsList



export type EntityList = Entity[]
