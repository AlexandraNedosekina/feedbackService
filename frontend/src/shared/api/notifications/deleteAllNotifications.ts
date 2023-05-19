import api from '..'
import { errorHandler } from '../errorHandler'

async function deleteAllNotifications(): Promise<string> {
	try {
		const res = await api.delete(`notifications/all/`)

		return res.data
	} catch (error: any) {
		throw errorHandler(error)
	}
}

export default deleteAllNotifications
