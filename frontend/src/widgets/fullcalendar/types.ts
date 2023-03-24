export interface ICreateEventForm {
	title: string
	desc?: string
	startTime: string | Date
	endTime: string | Date
	userId: string
}
