import api from '..'
import { errorHandler } from '../errorHandler'
import {
	BodyRejectCalendarEventCalendarCalendarIdRejectPost,
	CalendarEvent,
} from '../generatedTypes'

export default async function (
	calendarId: number,
	data: BodyRejectCalendarEventCalendarCalendarIdRejectPost
) {
	try {
		const res = await api.post<CalendarEvent>(
			`calendar/${calendarId}/reject`,
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
