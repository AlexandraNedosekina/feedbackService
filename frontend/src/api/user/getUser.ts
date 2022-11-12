import api, { getUserAdapter } from '..'
import { User } from '../generatedTypes'

async function getUser() {
	try {
		const res = await api.get<User>('/user/me')

		return getUserAdapter(res.data)
	} catch (error: any) {
		throw new Error(error)
	}
}

export default getUser
