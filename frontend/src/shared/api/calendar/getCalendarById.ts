import api from '..'
import { errorHandler } from '../errorHandler'
import { CalendarEvent } from '../generatedTypes'

async function getCalendarById(calendarId: number) {
	try {
		const res = await api.get<CalendarEvent>(`calendar/${calendarId}`)

		return res.data
	} catch (error: any) {
		return errorHandler(error)
	}
}

export default getCalendarById
