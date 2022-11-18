import api from '..'

async function signOut() {
	try {
		const res = await api.get('auth/signout')

		return res.data
	} catch (error: any) {
		throw new Error(error)
	}
}

export default signOut
