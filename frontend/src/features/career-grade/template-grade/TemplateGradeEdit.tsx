import { Button } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ICareerGradeFormValues } from 'entities/career'
import { useRouter } from 'next/router'
import { FormSpy } from 'react-final-form'
import { QueryKeys } from 'shared/api'
import { templateGradeLib } from '..'
import { Form } from '../components'

const defaultInitialValues: ICareerGradeFormValues = {
	title: '',
	salary: '',
	toComplete: [],
	toLearn: [],
	idsToDelete: [],
}

interface IProps {
	initialValues: ICareerGradeFormValues
	onDone?: () => void
}

export const TemplateGradeEdit = ({
	onDone,
	initialValues = defaultInitialValues,
}: IProps) => {
	const {
		query: { id },
	} = useRouter()
	const queryClient = useQueryClient()

	const { mutate: update, isLoading: isUpdateLoading } = useMutation({
		mutationFn: (data: ICareerGradeFormValues) =>
			templateGradeLib.updateGrade(data),
		onSuccess: () => {
			queryClient.invalidateQueries([QueryKeys.CAREER_TEMPLATE_BY_ID, id])
			onDone?.()
			showNotification({
				message: 'Данные успешно обновлены',
				color: 'green',
			})
		},
	})

	return (
		<Form
			onSubmit={values => {
				update(values)
			}}
			initialValues={initialValues}
			submitButtons={
				<FormSpy>
					{({ invalid, hasValidationErrors, submitting, dirty }) => (
						<Button
							sx={() => ({
								alignSelf: 'flex-end',
							})}
							type="submit"
							loading={isUpdateLoading}
							disabled={
								invalid || hasValidationErrors || submitting || !dirty
							}
						>
							Сохранить
						</Button>
					)}
				</FormSpy>
			}
		/>
	)
}
