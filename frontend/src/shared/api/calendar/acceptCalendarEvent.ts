import api from '..'
import { errorHandler } from '../errorHandler'
import { CalendarEvent } from '../generatedTypes'

export default async function (calendarId: number) {
	try {
		const res = await api.post<CalendarEvent>(`calendar/${calendarId}/accept`)

		return res.data
	} catch (error: any) {
		return errorHandler(error)
	}
}
