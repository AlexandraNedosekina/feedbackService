import { User } from '../generatedTypes'

export type TSearchUserAdapter = {
	value: string
	label: string
	full_name: string
	job_title: string
	email: string
	original: User
}

export default function searchUserByFullnameAdapter(
	users: User[]
): TSearchUserAdapter[] {
	return users.map(user => ({
		value: String(user.id),
		label: user.full_name || '',
		full_name: user.full_name || '',
		job_title: user.job_title || '',
		email: user.email || '',
		original: user,
	}))
}
