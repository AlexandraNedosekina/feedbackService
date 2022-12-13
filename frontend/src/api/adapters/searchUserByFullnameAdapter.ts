import { User } from '../generatedTypes'

export type SearchUser = {
	value: string
	label: string
	full_name: string
	job_title: string
	email: string
}

export default function searchUserByFullnameAdapter(
	users: User[]
): SearchUser[] {
	return users.map(user => ({
		value: String(user.id),
		label: user.full_name || '',
		full_name: user.full_name || '',
		job_title: user.job_title || '',
		email: user.email || '',
	}))
}
