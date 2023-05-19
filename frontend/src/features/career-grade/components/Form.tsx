import { Form as FinalForm } from 'react-final-form'
import { ICareerGradeFormValues } from 'entities/career'
import arrayMutators from 'final-form-arrays'
import { Stack } from '@mantine/core'
import { FormInput, required } from 'shared/ui'
import Tasks from './Tasks'
import { FormApi } from 'final-form'

interface IProps {
	onSubmit: (
		values: ICareerGradeFormValues,
		form: FormApi<ICareerGradeFormValues, Partial<ICareerGradeFormValues>>
	) => void
	submitButtons: React.ReactNode
	initialValues?: Partial<ICareerGradeFormValues>
}

export const Form = ({ submitButtons, onSubmit, initialValues }: IProps) => {
	return (
		<FinalForm<ICareerGradeFormValues>
			onSubmit={onSubmit}
			initialValues={initialValues}
			subscription={{
				submitting: true,
				pristine: true,
			}}
			initialValuesEqual={() => true}
			validate={values => {
				const errors: Partial<
					Record<keyof ICareerGradeFormValues, string>
				> = {}

				if (!values.toComplete?.length) {
					errors.toComplete = 'Необходимо добавить хотя бы один пункт'
				}
				if (!values.toLearn?.length) {
					errors.toLearn = 'Необходимо добавить хотя бы один пункт'
				}

				return errors
			}}
			mutators={{
				...arrayMutators,
			}}
		>
			{props => {
				return (
					<form
						onSubmit={props.handleSubmit}
						onKeyDown={e => {
							if (e.key === 'Enter') {
								e.preventDefault()
							}
						}}
						onKeyUp={e => {
							if (e.key === 'Enter') {
								e.preventDefault()
							}
						}}
					>
						<Stack>
							<FormInput
								name="title"
								validate={required}
								label="Название"
								autoComplete="off"
								withAsterisk={true}
								required={true}
							/>
							<FormInput
								name="salary"
								label="Зарплата"
								autoComplete="off"
								type="number"
							/>

							<Tasks title="Что нужно изучить" type="toLearn" />
							<Tasks title="Что нужно сделать" type="toComplete" />

							{submitButtons}
						</Stack>
					</form>
				)
			}}
		</FinalForm>
	)
}
