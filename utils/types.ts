export interface Entity {
	name: string,
	objective: string,
	coordinates?: number[] | null,
	pdfLink?: string
	logoLink?: string
	hub?: number
}

export interface Hub {
	name: string,
	horizontalPosition: number,
	verticalPosition: number,
	startOfCoordinates: number,
	pointToShow: { coordinates: number[] },
	coordinates: { coordinates: number[] }
}

export type EntityList = Entity[]
