export enum ECareerGradeStatus {
	notCompleted = 'not_completed',
	completed = 'completed',
	current = 'current',
}

export interface ICareerGradeParam {
	text: string
	apiId?: string
}

export interface ICareerGradeFormValues {
	title: string
	salary: string
	toLearn: ICareerGradeParam[]
	toComplete: ICareerGradeParam[]
	idsToDelete: string[]
}
