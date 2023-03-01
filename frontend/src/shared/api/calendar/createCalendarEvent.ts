import api from '..'
import { errorHandler } from '../errorHandler'
import { CalendarEvent, CalendarEventCreate } from '../generatedTypes'

export default async function (data: CalendarEventCreate) {
	try {
		const res = await api.post<CalendarEvent>(`calendar`, data, {
			headers: {
				'Content-Type': 'application/json',
			},
		})

		return res.data
	} catch (error: any) {
		return errorHandler(error)
	}
}
