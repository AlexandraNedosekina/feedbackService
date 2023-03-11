import api from '..'
import { errorHandler } from '../errorHandler'
import { CalendarEvent, CalendarEventReshedule } from '../generatedTypes'

export default async function (
	calendarId: number,
	data: CalendarEventReshedule
) {
	try {
		const res = await api.post<CalendarEvent>(
			`calendar/${calendarId}/reshedule`,
			data,
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		)

		return res.data
	} catch (error: any) {
		return errorHandler(error)
	}
}
