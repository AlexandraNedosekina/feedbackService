import { TCareerAdapter } from 'shared/api'
import { EStatus } from '../types'

export const setInitialStatus = (
	grade: TCareerAdapter | undefined
): EStatus => {
	if (grade?.is_completed) return EStatus.completed
	if (grade?.is_current) return EStatus.current
	return EStatus.notCompleted
}
