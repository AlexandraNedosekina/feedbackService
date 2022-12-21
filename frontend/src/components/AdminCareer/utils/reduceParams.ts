import { CareerParamCreate, CareerParamUpdate } from 'src/api/generatedTypes'
import { ICareerGradeParam } from 'src/stores'

export function reduceParams(
	params: ICareerGradeParam[],
	type: 'to_learn' | 'to_complete'
) {
	return params.reduce<{
		created: CareerParamCreate[]
		edited: CareerParamUpdate[]
		deleted: string[]
	}>(
		(prev, curr) => {
			if (curr.isDeleted) {
				// From api
				if (!curr.isCreated) {
					prev.deleted.push(curr.id)
				}
			} else {
				if (curr.isCreated) {
					prev.created.push({
						description: curr.text,
						type,
					})
				} else if (curr.isEdited) {
					prev.edited.push({
						id: +curr.id,
						description: curr.text,
						type,
					})
				}
			}

			return prev
		},
		{
			created: [],
			edited: [],
			deleted: [],
		}
	)
}
