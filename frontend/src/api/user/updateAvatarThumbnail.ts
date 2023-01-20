import api from '..'
import { errorHandler } from '../errorHandler'
import { AvatarUpdate } from '../generatedTypes'

async function deleteAvatar(userId: number, data: AvatarUpdate) {
	try {
		const res = await api.put(`user/${userId}/avatar`, data)

		return res.data
	} catch (error: any) {
		return errorHandler(error)
	}
}

export default deleteAvatar
