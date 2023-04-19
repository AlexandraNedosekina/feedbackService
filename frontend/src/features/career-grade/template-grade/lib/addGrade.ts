import { ICareerGradeFormValues } from 'entities/career'
import { templateGradeModel } from 'features/career-grade'
import produce from 'immer'
import { updateCareerTemplate } from 'shared/api'
import { CareerTemplate, CareerTrackTemplate } from 'shared/api/generatedTypes'

export function addGrade(
	data: Omit<ICareerGradeFormValues, 'idsToDelete'>
): Promise<CareerTemplate> {
	const { template } = templateGradeModel.useTemplateStore.getState()
	if (!template) throw new Error('no template')

	const grade: CareerTrackTemplate = {
		name: data.title,
		salary: +data.salary,
		params: [
			...data.toLearn.map(i => ({
				type: 'to_learn' as const,
				description: i.text,
			})),
			...data.toComplete.map(i => ({
				type: 'to_complete' as const,
				description: i.text,
			})),
		],
	}

	const newTemplate = produce(template, draft => {
		draft.template.push(grade)
	})

	return new Promise((res, rej) => {
		updateCareerTemplate(String(newTemplate.id), {
			name: newTemplate.name,
			template: newTemplate.template,
		})
			.then(result => res(result))
			.catch(err => rej(err))
	})
}
