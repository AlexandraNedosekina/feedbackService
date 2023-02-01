import { TCareerAdapter } from 'shared/api'
import { careerTypes } from 'entities/career'

export const setInitialStatus = (
	grade: TCareerAdapter | undefined
): careerTypes.EStatus => {
	if (grade?.is_completed) return careerTypes.EStatus.completed
	if (grade?.is_current) return careerTypes.EStatus.current
	return careerTypes.EStatus.notCompleted
}
