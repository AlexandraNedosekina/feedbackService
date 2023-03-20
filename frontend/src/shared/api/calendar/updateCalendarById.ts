import api from '..'
import { errorHandler } from '../errorHandler'
import { CalendarEvent, CalendarEventUpdate } from '../generatedTypes'

export default async function (calendarId: number, data: CalendarEventUpdate) {
	try {
		const res = await api.patch<CalendarEvent>(
			`calendar/${calendarId}`,
			data,
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		)

		return res.data
	} catch (error: any) {
		throw errorHandler(error)
	}
}
