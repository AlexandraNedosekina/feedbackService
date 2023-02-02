import { CareerParamCreate, CareerParamUpdate } from 'shared/api/generatedTypes'
import { ICareerGradeFormValues } from 'entities/career'

export function reduceParams(
	dirtyFields: { [key: string]: boolean },
	params: ICareerGradeFormValues['toComplete'],
	type: 'to_learn' | 'to_complete'
) {
	const typeCamelCase = type.replace(/_./g, match => match[1].toUpperCase())

	return params.reduce<{
		created: CareerParamCreate[]
		updated: CareerParamUpdate[]
	}>(
		(acc, item, index) => {
			if (item.apiId) {
				if (dirtyFields[`${typeCamelCase}[${index}].text`]) {
					acc.updated.push({
						id: +item.apiId,
						description: item.text,
						type,
					})
				}
			} else {
				acc.created.push({
					description: item.text,
					type,
				})
			}
			return acc
		},
		{
			created: [],
			updated: [],
		}
	)
}
