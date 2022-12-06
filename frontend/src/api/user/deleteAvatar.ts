import api from '..'
import { errorHandler } from '../errorHandler'

async function deleteAvatar(userId: number) {
	try {
		const res = await api.delete(`user/${userId}/avatar`)

		return res.data
	} catch (error: any) {
		throw new Error(errorHandler(error))
	}
}

export default deleteAvatar
