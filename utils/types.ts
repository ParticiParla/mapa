export interface Entity {
	id: number,
	name: string,
	objective: string,
	coordinates?: number[] | null,
	pdfLink?: string
	logo?: string
	logoLink?: string
	hub?: number
	description?: string
	schedule?: string
	activities?: string
	participate?: string
	observations?: string
	contact?: string
}

export interface Hub {
	id: number,
	name: string,
	horizontalPosition: number,
	verticalPosition: number,
	startOfCoordinates: number,
	pointToShow: { coordinates: number[] },
	coordinates: { coordinates: number[] }
}

export type EntityList = Entity[]
