import api from '..'
import { errorHandler } from '../errorHandler'
import { CareerTrack, CareerTrackCreate } from '../generatedTypes'

async function createCareerTrack(
	data: CareerTrackCreate
): Promise<CareerTrack> {
	try {
		const res = await api.post<CareerTrack>('career', data, {
			headers: {
				'Content-Type': 'application/json',
			},
		})

		return res.data
	} catch (error: any) {
		return errorHandler(error)
	}
}

export default createCareerTrack
