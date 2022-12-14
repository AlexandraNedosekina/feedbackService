import { CareerParam, CareerTrack } from '../generatedTypes'

type TCareer = CareerTrack & {
	toLearn: CareerParam[]
	toComplete: CareerParam[]
}
export default function getMyCareerAdapter(
	careerTracks: CareerTrack[]
): TCareer[] {
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
