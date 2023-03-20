import api, { getUserAdapter } from '..'
import { errorHandler } from '../errorHandler'
import { User } from '../generatedTypes'

async function getUser() {
	try {
		const res = await api.get<User>('/user/me')

		return getUserAdapter(res.data)
	} catch (error: any) {
		throw errorHandler(error)
	}
}

export default getUser
