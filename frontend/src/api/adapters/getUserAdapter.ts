import { IProfileBadge } from 'src/types/profile'
import { Fact, JobExpectation, Skill, User } from '../generatedTypes'

function getBadge(item: Fact | Skill | JobExpectation): IProfileBadge {
	return {
		id: item.id!,
		label: item.description,
	}
}

export type TProfileBadges = Record<
	keyof Pick<User, 'facts' | 'skills' | 'job_expectations'>,
	IProfileBadge[]
>
export type TUserAdapter = Omit<User, 'facts' | 'skills' | 'job_expectations'> &
	TProfileBadges

export default function getUserAdapter(user: User): TUserAdapter {
	const facts = user.facts!.map(getBadge)
	const skills = user.skills!.map(getBadge)
	const job_expectations = user.job_expectations!.map(getBadge)

	return {
		...user,
		facts,
		skills,
		job_expectations,
	}
}
