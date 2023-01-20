import api from '..'
import { errorHandler } from '../errorHandler'
import { CareerTrack, CareerTrackUpdate } from '../generatedTypes'

async function updateCareerTrack(
	careerId: string,
	data: CareerTrackUpdate
): Promise<CareerTrack> {
	try {
		const res = await api.patch<CareerTrack>(`career/${careerId}`, data, {
			headers: {
				'Content-Type': 'application/json',
			},
		})

		return res.data
	} catch (error: any) {
		return errorHandler(error)
	}
}

export default updateCareerTrack
