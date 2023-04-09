import { Button } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ICareerGradeFormValues } from 'entities/career'
import { useRouter } from 'next/router'
import { FormSpy } from 'react-final-form'
import { QueryKeys } from 'shared/api'
import { templateGradeLib } from '..'
import { Form } from '../components'

interface IProps {
	onDone?: () => void
}

export const TemplateGradeAdd = ({ onDone }: IProps) => {
	const {
		query: { id },
	} = useRouter()
	const queryClient = useQueryClient()

	const { mutate: create, isLoading: isCreateLoading } = useMutation({
		mutationFn: (data: Omit<ICareerGradeFormValues, 'idsToDelete'>) =>
			templateGradeLib.addGrade(data),
		onSuccess: () => {
			queryClient.invalidateQueries([QueryKeys.CAREER_TEMPLATE_BY_ID, id])
			showNotification({
				message: 'Этап успешно добавлен',
				color: 'green',
			})
			onDone?.()
		},
	})

	return (
		<Form
			onSubmit={values => {
				create(values)
			}}
			submitButtons={
				<FormSpy>
					{({ invalid, hasValidationErrors, dirty }) => (
						<Button
							sx={() => ({
								alignSelf: 'flex-end',
							})}
							type="submit"
							loading={isCreateLoading}
							disabled={invalid || hasValidationErrors || !dirty}
						>
							Добавить
						</Button>
					)}
				</FormSpy>
			}
		/>
	)
}
