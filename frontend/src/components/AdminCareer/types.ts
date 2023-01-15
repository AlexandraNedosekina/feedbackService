interface ICareerGradeParam {
	text: string
	id?: string
}

export interface IFormValues {
	title: string
	salary: string
	toLearn: ICareerGradeParam[]
	toComplete: ICareerGradeParam[]
}
