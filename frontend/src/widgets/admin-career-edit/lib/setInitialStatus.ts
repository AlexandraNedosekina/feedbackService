import { TCareerAdapter } from 'shared/api'
import { ECareerGradeStatus } from 'entities/career'

export const setInitialStatus = (
	grade: TCareerAdapter | undefined
): ECareerGradeStatus => {
	if (grade?.is_completed) return ECareerGradeStatus.completed
	if (grade?.is_current) return ECareerGradeStatus.current
	return ECareerGradeStatus.notCompleted
}
