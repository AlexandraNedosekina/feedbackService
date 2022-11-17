import api from '..'

async function getAvatarThumbnail(userId: number): Promise<string | null> {
	try {
		const res = await api.get(`/user/${userId}/avatar`, {
			responseType: 'blob',
			validateStatus(status) {
				return status === 200 || status === 404
			},
		})

		if (res.status === 404) {
			return null
		}

		return URL.createObjectURL(res.data)
	} catch (error: any) {
		console.log({ error })
		throw new Error(error)
	}
}

export default getAvatarThumbnail
