import { careerModel } from 'entities/career'
import { templateGradeModel } from 'features/career-grade'
import produce from 'immer'
import { updateCareerTemplate } from 'shared/api'

export function deleteGrade() {
	const { template } = templateGradeModel.useTemplateStore.getState()
	const { selectedGradeId } = careerModel.useEdit.getState()
	if (!template || !selectedGradeId)
		throw new Error('no template or seleted grade id')

	const newTemplate = produce(template, draft => {
		draft.template.splice(+selectedGradeId, 1)
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
