import api from '..'
import { User } from '../generatedTypes'

export type TUpdateUser = Record<
	keyof Pick<User, 'facts' | 'skills' | 'job_expectations'>,
	string[]
>

async function updateUser(userId: number, data: TUpdateUser) {
	try {
		const res = await api.patch(`user/${userId}`, data)

		return res.data
	} catch (error: any) {
		throw new Error(error)
	}
}

export default updateUser
