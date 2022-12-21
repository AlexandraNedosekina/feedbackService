import api from '..'
import { errorHandler } from '../errorHandler'

async function deleteCareerParam(paramId: string): Promise<string> {
	try {
		const res = await api.delete(`career/params/${paramId}`)

		return res.data
	} catch (error: any) {
		throw new Error(errorHandler(error))
	}
}

export default deleteCareerParam
