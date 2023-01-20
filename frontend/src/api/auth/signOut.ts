import api from '..'
import { errorHandler } from '../errorHandler'

async function signOut() {
	try {
		const res = await api.get('auth/signout')

		return res.data
	} catch (error: any) {
		return errorHandler(error)
	}
}

export default signOut
