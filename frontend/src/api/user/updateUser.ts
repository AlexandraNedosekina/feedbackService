import api from '..'
import { User } from '../generatedTypes'

export type UpdateUser =
	| User['facts']
	| User['skills']
	| User['job_expectations']

async function updateUser(userId: number, data: UpdateUser) {
	try {
		const res = await api.patch(`user/${userId}`, data)

		return res.data
	} catch (error: any) {
		throw new Error(error)
	}
}

export default updateUser
