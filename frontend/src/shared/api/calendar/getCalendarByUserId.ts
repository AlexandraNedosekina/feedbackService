import api from '..'
import { errorHandler } from '../errorHandler'
import {
	CalendarEvent,
	CalendarEventStatus,
	CalendarFormat,
} from '../generatedTypes'

export default async function (
	userId: number,
	date: string,
	format: CalendarFormat,
	status?: CalendarEventStatus
) {
	try {
		const res = await api.get<CalendarEvent[]>('calendar', {
			params: {
				user_id: userId,
				date,
				format,
				status,
			},
		})

		return res.data
	} catch (error: any) {
		throw errorHandler(error)
	}
}
