export interface IFormValues {
	type: 'one' | 'all'
	startTime: string
	startDate: string
	endTime: string
	endDate: string
	twoWay?: boolean
	userId?: string
}
