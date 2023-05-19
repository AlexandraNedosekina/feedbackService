import { templateGradeModel } from 'features/career-grade'
import { updateCareerTemplate } from 'shared/api'
import { CareerTemplate } from 'shared/api/generatedTypes'

export function updateTitle(title: string): Promise<CareerTemplate> {
	const { template } = templateGradeModel.useTemplateStore.getState()
	if (!template) throw new Error('no template')

	return new Promise((res, rej) => {
		updateCareerTemplate(String(template.id), {
			name: title,
			template: template.template,
		})
			.then(result => res(result))
			.catch(err => rej(err))
	})
}
