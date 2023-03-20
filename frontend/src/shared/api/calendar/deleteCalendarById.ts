import api from '..'
import { errorHandler } from '../errorHandler'

export default async function (calendarId: number) {
	try {
		const res = await api.delete(`calendar/${calendarId}`)

		return res.data
	} catch (error: any) {
		throw errorHandler(error)
	}
}
