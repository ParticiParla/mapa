export interface Entity {
	name: string,
	objective: string,
	coordinates?: number[] | EntityHubs | null,
	pdfLink?: string
	logoLink?: string
}

export const EntityHubsList = {
	momo: {
		name: "Momo",
		coordinates: [40.2418433240197, -3.7749668485938326],
		positionToShow: [40.241774832501676, -3.7851419541709324],
		startOfCoordinates: 1.5,
		verticalPosition: -2,
		horizontalPosition: -10

	},
	toros: {
		name: "Plaza de Toros",
		coordinates: [40.24409836145415, -3.7579713273575486],
		positionToShow: [40.24565101545685, -3.755052981944479],
		startOfCoordinates: 0,
		verticalPosition: -15,
		horizontalPosition: 0
	},
	vicente: {
		name: "Edificio Asociativo Vicente Aleixandre",
		coordinates: [40.243438842584354, -3.7658926536887534],
		positionToShow: [40.24842185044188, -3.7630888247399477],
		startOfCoordinates: 1.1,
		verticalPosition: -10,
		horizontalPosition: 3

	},
}

export type EntityHubs = keyof typeof EntityHubsList



export type EntityList = Entity[]
