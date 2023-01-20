import api from '..'
import { errorHandler } from '../errorHandler'
import { User } from '../generatedTypes'

export type TUpdateUser =
	| Record<keyof Pick<User, 'facts' | 'skills' | 'job_expectations'>, string[]>
	| {
			work_format: User['work_format']
	  }
	| {
			meeting_readiness: boolean
	  }
	| {
			work_hours_start: string | null
			work_hours_end: string | null
	  }

async function updateUser(userId: number, data: TUpdateUser) {
	try {
		const res = await api.patch(`user/${userId}`, data)

		return res.data
	} catch (error: any) {
		return errorHandler(error)
	}
}

export default updateUser
