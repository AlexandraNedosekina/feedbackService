import { Button, Stack } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { careerModel, ICareerGradeFormValues } from 'entities/career'
import arrayMutators from 'final-form-arrays'
import { useRouter } from 'next/router'
import { Form, FormSpy } from 'react-final-form'
import { createCareerTrack, QueryKeys } from 'shared/api'
import { CareerParamCreate, CareerTrackCreate } from 'shared/api/generatedTypes'
import { FormInput, required } from 'shared/ui'
import {
	IUpdateCareerTrackAllParams,
	reduceParams,
	updateCareerTrackAll,
} from '../lib'
import Tasks from './Tasks'

const defaultInitialValues: ICareerGradeFormValues = {
	title: '',
	salary: '',
	toComplete: [],
	toLearn: [],
	idsToDelete: [],
}

interface IProps {
	onClose?: () => void
	initialValues?: ICareerGradeFormValues
}

export default ({ onClose, initialValues = defaultInitialValues }: IProps) => {
	const store = careerModel.useEditGrade()
	const {
		query: { id },
	} = useRouter()
	const queryClient = useQueryClient()

	const { mutate: create, isLoading: isCreateLoading } = useMutation({
		mutationFn: (data: CareerTrackCreate) => createCareerTrack(data),
		onSuccess: () => {
			queryClient.invalidateQueries([QueryKeys.CAREER_BY_USER_ID, id])
			store.restore()
			onClose?.()
		},
	})
	const { mutate: update, isLoading: isUpdateLoading } = useMutation({
		mutationFn: (data: IUpdateCareerTrackAllParams) =>
			updateCareerTrackAll(data),
		onSuccess: () => {
			queryClient.invalidateQueries([QueryKeys.CAREER_BY_USER_ID, id])
			store.restore()
			onClose?.()
			showNotification({
				title: 'Успешно',
				message: 'Данные успешно обновлены',
				color: 'green',
			})
		},
	})

	return (
		<Form<ICareerGradeFormValues>
			onSubmit={(values, { getState }) => {
				const { dirtyFields } = getState()

				if (store.isEdit && store.careerId) {
					const { created: toLearnCreated, updated: toLearnUpdated } =
						reduceParams(dirtyFields, values.toLearn, 'to_learn')
					const {
						created: toCompleteCreated,
						updated: toCompleteUpdated,
					} = reduceParams(dirtyFields, values.toComplete, 'to_complete')

					update({
						careerId: store.careerId,
						name: values.title,
						salary: +values.salary ?? 0,
						paramsToAdd: [...toLearnCreated, ...toCompleteCreated],
						paramsToDelete: values.idsToDelete,
						paramsToUpdate: [...toLearnUpdated, ...toCompleteUpdated],
					})
					return
				}

				const toLearn: CareerParamCreate[] = values.toLearn.map(item => ({
					description: item.text,
					type: 'to_learn',
				}))
				const toComplete: CareerParamCreate[] = values.toComplete.map(
					item => ({
						description: item.text,
						type: 'to_complete',
					})
				)

				const data: CareerTrackCreate = {
					user_id: +(id as string),
					name: values.title,
					salary: +values.salary ?? 0,
					params: [...toLearn, ...toComplete],
				}

				create(data)
			}}
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

							<FormSpy>
								{({
									invalid,
									hasValidationErrors,
									submitting,
									dirty,
								}) => (
									<Button
										sx={() => ({
											alignSelf: 'flex-end',
										})}
										type="submit"
										loading={isCreateLoading || isUpdateLoading}
										disabled={
											invalid ||
											hasValidationErrors ||
											submitting ||
											!dirty
										}
									>
										{store.isEdit ? 'Сохранить' : 'Добавить'}
									</Button>
								)}
							</FormSpy>
						</Stack>
					</form>
				)
			}}
		</Form>
	)
}
