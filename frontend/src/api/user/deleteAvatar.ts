import api from '..'

async function deleteAvatar(userId: number) {
	try {
		const res = await api.delete(`user/${userId}/avatar`)

		return res.data
	} catch (error: any) {
		throw new Error(error)
	}
}

export default deleteAvatar
