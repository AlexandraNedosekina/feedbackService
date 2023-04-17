import api from '..'
import { errorHandler } from '../errorHandler'
import { ApplyTemplateOpts } from '../generatedTypes'

async function applyCareerTemplate(
	templateId: string,
	data: ApplyTemplateOpts
) {
	try {
		const res = await api.post(
			`career/template/${templateId}/apply`,
			data,
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		)

		return res.data
	} catch (error: any) {
		throw errorHandler(error)
	}
}

export default applyCareerTemplate
