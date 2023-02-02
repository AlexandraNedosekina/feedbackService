import { IProfileBadge } from 'entities/profile'
import { ERoles } from 'shared/types'
import { Fact, JobExpectation, Skill, User } from '../generatedTypes'

export type TProfileBadges = Record<
	keyof Pick<User, 'facts' | 'skills' | 'job_expectations'>,
	IProfileBadge[]
>
export type TUserAdapter = Omit<
	User,
	| 'facts'
	| 'skills'
	| 'job_expectations'
	| 'work_hours_start'
	| 'work_hours_end'
	| 'roles'
> &
	TProfileBadges & {
		work_hours_start: Date | null
		work_hours_end: Date | null
	} & { roles: (keyof typeof ERoles)[] }

export default function getUserAdapter(user: User): TUserAdapter {
	const facts = user.facts?.map(getBadge) ?? []
	const skills = user.skills?.map(getBadge) ?? []
	const job_expectations = user.job_expectations?.map(getBadge) ?? []
	const work_hours_start = getDateFromTime(user.work_hours_start)
	const work_hours_end = getDateFromTime(user.work_hours_end)
	const roles = user.roles?.map(role => role.description) ?? []

	return {
		...user,
		facts,
		skills,
		job_expectations,
		work_hours_start,
		work_hours_end,
		roles,
	}
}

function getBadge(item: Fact | Skill | JobExpectation): IProfileBadge {
	return {
		id: item?.id ?? Math.random(),
		label: item.description,
	}
}

function getDateFromTime(time: string | undefined): Date | null {
	if (!time) return null

	const date = new Date()
	const [hours, minutes] = time.split(':')

	date.setHours(+hours)
	date.setMinutes(+minutes)

	return date
}
