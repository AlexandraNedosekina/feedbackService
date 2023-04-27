import api from '..'
import { errorHandler } from '../errorHandler'

async function seeAllNotifications() {
	try {
		const res = await api.patch(`notifications/all/`)

		return res.data
	} catch (error: any) {
		throw errorHandler(error)
	}
}

export default seeAllNotifications
