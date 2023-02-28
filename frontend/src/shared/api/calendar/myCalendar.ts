import api from '..'
import { errorHandler } from '../errorHandler'
import {
	CalendarEvent,
	CalendarEventStatus,
	CalendarFormat,
} from '../generatedTypes'

async function myCalendar(
	date: string,
	format: CalendarFormat,
	status?: CalendarEventStatus
) {
	try {
		const res = await api.get<CalendarEvent[]>('calendar/me', {
			params: {
				date,
				format,
				status,
			},
		})

		return res.data
	} catch (error: any) {
		return errorHandler(error)
	}
}

export default myCalendar
