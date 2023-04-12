import { Button } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ICareerGradeFormValues } from 'entities/career'
import { useRouter } from 'next/router'
import { FormSpy } from 'react-final-form'
import { QueryKeys } from 'shared/api'
import { Form } from '../components'
import { reduceParams } from '../lib'
import {
	IUpdateCareerTrackAllParams,
	updateCareerTrackAll,
} from '../lib/updateCareerTrackAll'

const defaultInitialValues: ICareerGradeFormValues = {
	title: '',
	salary: '',
	toComplete: [],
	toLearn: [],
	idsToDelete: [],
}

interface IProps {
	careerId: string
	initialValues: ICareerGradeFormValues
	onDone?: () => void
}

export const PersonalGradeEdit = ({
	onDone,
	careerId,
	initialValues = defaultInitialValues,
}: IProps) => {
	const {
		query: { id },
	} = useRouter()
	const queryClient = useQueryClient()

	const { mutate: update, isLoading: isUpdateLoading } = useMutation({
		mutationFn: (data: IUpdateCareerTrackAllParams) =>
			updateCareerTrackAll(data),
		onSuccess: () => {
			queryClient.invalidateQueries([QueryKeys.CAREER_BY_USER_ID, id])
			onDone?.()
			showNotification({
				title: 'Успешно',
				message: 'Данные успешно обновлены',
				color: 'green',
			})
		},
	})

	return (
		<Form
			onSubmit={(values, { getState }) => {
				const { dirtyFields } = getState()

				const { created: toLearnCreated, updated: toLearnUpdated } =
					reduceParams(dirtyFields, values.toLearn, 'to_learn')
				const { created: toCompleteCreated, updated: toCompleteUpdated } =
					reduceParams(dirtyFields, values.toComplete, 'to_complete')

				update({
					careerId,
					name: values.title,
					salary: +values.salary ?? 0,
					paramsToAdd: [...toLearnCreated, ...toCompleteCreated],
					paramsToDelete: values.idsToDelete,
					paramsToUpdate: [...toLearnUpdated, ...toCompleteUpdated],
				})
				return
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
