import api from '..'
import { errorHandler } from '../errorHandler'
import { BodyCreateAvaterUserUserIdAvatarPost } from '../generatedTypes'

async function createAvatar(
	userId: number,
	{ file, height, width, x, y }: BodyCreateAvaterUserUserIdAvatarPost
) {
	try {
		const res = await api.post(
			`user/${userId}/avatar`,
			{
				file,
				width,
				height,
				x,
				y,
			},
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			}
		)

		return res.data
	} catch (error: any) {
		return errorHandler(error)
	}
}

export default createAvatar
