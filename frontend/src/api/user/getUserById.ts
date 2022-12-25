import api, { getUserAdapter } from '..'
import { errorHandler } from '../errorHandler'
import { User } from '../generatedTypes'

async function getUserById(userId: string) {
	try {
		const res = await api.get<User>(`user/${userId}`)

		return getUserAdapter(res.data)
	} catch (error: any) {
		throw new Error(errorHandler(error))
	}
}

export default getUserById
