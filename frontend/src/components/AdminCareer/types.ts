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
