import api from '..'
import { errorHandler } from '../errorHandler'

async function deleteCareerTemplate(templateId: number) {
	try {
		const res = await api.delete(`/career/template/${templateId}`)

		return res.data
	} catch (error: any) {
		throw errorHandler(error)
	}
}

export default deleteCareerTemplate
