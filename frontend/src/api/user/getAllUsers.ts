import api from '..'
import { errorHandler } from '../errorHandler'
import { User } from '../generatedTypes'

async function getAllUsers(skip = 0, limit = 100) {
	try {
		const res = await api.get<User[]>('/user', {
			params: {
				skip,
				limit,
			},
		})

		return res.data
	} catch (error: any) {
		return errorHandler(error)
	}
}

export default getAllUsers
