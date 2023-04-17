import api from '..'
import { errorHandler } from '../errorHandler'
import {
	PaginatedResponseCareerTemplate,
} from '../generatedTypes'

interface IParams {
	by: number
	name: string
	skip: number
	limit: number
}

async function getCareerTemplates(params?: Partial<IParams>) {
	try {
		const res = await api.get<PaginatedResponseCareerTemplate>(
			'career/template/',
			{
				params: {
					by: params?.by,
					name: params?.name,
					skip: params?.skip || 0,
					limit: params?.limit || 100,
				},
			}
		)

		return res.data
	} catch (error: any) {
		throw errorHandler(error)
	}
}

export default getCareerTemplates
