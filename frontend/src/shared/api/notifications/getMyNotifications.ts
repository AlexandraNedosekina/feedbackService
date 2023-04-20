import api from '..'
import { errorHandler } from '../errorHandler'
import { Notification } from '../generatedTypes'

async function getMyNotifactions() {
	try {
		const res = await api.get<Notification[]>(`notificaions/me`)

		return res.data
	} catch (error: any) {
		throw errorHandler(error)
	}
}

export default getMyNotifactions
