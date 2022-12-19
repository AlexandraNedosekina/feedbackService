import api from '..'
import { errorHandler } from '../errorHandler'

async function deleteCareerTrack(careerId: string) {
	try {
		const res = await api.delete(`/career/${careerId}`)

		return res.data
	} catch (error: any) {
		throw new Error(errorHandler(error))
	}
}

export default deleteCareerTrack
