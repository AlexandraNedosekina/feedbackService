import api from '..'
import { errorHandler } from '../errorHandler'

async function seeNotification(notificationId: string) {
	try {
		const res = await api.patch(`notifications/${notificationId}`)

		return res.data
	} catch (error: any) {
		throw errorHandler(error)
	}
}

export default seeNotification
