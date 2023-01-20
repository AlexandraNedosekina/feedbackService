import api from '..'
import searchUserByFullnameAdapter from '../adapters/searchUserByFullnameAdapter'
import { errorHandler } from '../errorHandler'
import { User } from '../generatedTypes'

async function searchUserByFullname(query: string) {
	try {
		const res = await api.get<User[]>('promts/full_name', {
			params: {
				q: query,
			},
		})

		return searchUserByFullnameAdapter(res.data)
	} catch (error: any) {
		return errorHandler(error)
	}
}

export default searchUserByFullname
