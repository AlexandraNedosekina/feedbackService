import api from '..'
import { errorHandler } from '../errorHandler'

async function deleteNotification(notificationId: string): Promise<string> {
	try {
		const res = await api.delete(`notifications/${notificationId}`)

		return res.data
	} catch (error: any) {
		throw errorHandler(error)
	}
}

export default deleteNotification
