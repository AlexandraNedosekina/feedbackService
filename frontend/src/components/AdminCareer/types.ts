interface ICareerGradeParam {
	text: string
	apiId?: string
}

export interface IFormValues {
	title: string
	salary: string
	toLearn: ICareerGradeParam[]
	toComplete: ICareerGradeParam[]
	idsToDelete: string[]
}

export enum EStatus {
	notCompleted = 'not_completed',
	completed = 'completed',
	current = 'current',
}
