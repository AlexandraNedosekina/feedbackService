import { CareerParam, CareerTrack } from '../generatedTypes'

export type TCareerAdapter = CareerTrack & {
	toLearn: CareerParam[]
	toComplete: CareerParam[]
}
export default function getMyCareerAdapter(
	careerTracks: CareerTrack[]
): TCareerAdapter[] {
	return careerTracks.map(careerTrack => {
		const toLearn =
			careerTrack.params?.filter(param => param.type === 'to_learn') ?? []
		const toComplete =
			careerTrack.params?.filter(param => param.type === 'to_complete') ?? []

		return {
			...careerTrack,
			toLearn,
			toComplete,
		}
	})
}
