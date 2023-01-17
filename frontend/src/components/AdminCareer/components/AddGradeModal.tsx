import { FormInput, required } from '@components/form'
import { Button, Modal, Stack, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import arrayMutators from 'final-form-arrays'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { Form, FormSpy } from 'react-final-form'
import { createCareerTrack, QueryKeys } from 'src/api'
import { CareerParamCreate, CareerTrackCreate } from 'src/api/generatedTypes'
import { useAddCareerGrade } from 'src/stores'
import { IFormValues } from '../types'
import { reduceParams } from '../utils/reduceParams'
import {
	IUpdateCareerTrackAllParams,
	updateCareerTrackAll,
} from '../utils/updateCareerTrackAll'
import Tasks from './Tasks'

const defaultInitialValues: IFormValues = {
	title: '',
	salary: '',
	toComplete: [],
	toLearn: [],
	idsToDelete: [],
}

interface Props {
	isOpen: boolean
	onClose: () => void
	initialValues?: IFormValues
}

const AddGradeModal: FC<Props> = ({
	isOpen,
	onClose,
	initialValues = defaultInitialValues,
}) => {
	const store = useAddCareerGrade()
	const {
		query: { id },
	} = useRouter()
	const queryClient = useQueryClient()

	const { mutate: create, isLoading: isCreateLoading } = useMutation({
		mutationFn: (data: CareerTrackCreate) => createCareerTrack(data),
		onSuccess: () => {
			queryClient.invalidateQueries([QueryKeys.CAREER_BY_USER_ID, id])
			store.restore()
			onClose()
		},
	})
	const { mutate: update, isLoading: isUpdateLoading } = useMutation({
		mutationFn: (data: IUpdateCareerTrackAllParams) =>
			updateCareerTrackAll(data),
		onSuccess: () => {
			queryClient.invalidateQueries([QueryKeys.CAREER_BY_USER_ID, id])
			store.restore()
			onClose()
			showNotification({
				title: 'Успешно',
				message: 'Данные успешно обновлены',
				color: 'green',
			})
		},
	})

	return (
		<Modal
			opened={isOpen}
			onClose={onClose}
			title={
				<Title order={4}>
					{store.isEdit ? 'Редактирование этапа' : 'Создание этапа'}
				</Title>
			}
			size="lg"
		>
			<Form<IFormValues>
				onSubmit={(values, { getState }) => {
					const { dirtyFields } = getState()

					if (store.isEdit && store.careerId) {
						const { created: toLearnCreated, updated: toLearnUpdated } =
							reduceParams(dirtyFields, values.toLearn, 'to_learn')
						const {
							created: toCompleteCreated,
							updated: toCompleteUpdated,
						} = reduceParams(
							dirtyFields,
							values.toComplete,
							'to_complete'
						)

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

					const toLearn: CareerParamCreate[] = values.toLearn.map(
						item => ({
							description: item.text,
							type: 'to_learn',
						})
					)
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
					const errors: Partial<Record<keyof IFormValues, string>> = {}

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
									fieldProps={{
										name: 'title',
										validate: required,
									}}
									inputProps={{
										label: 'Название',
										autoComplete: 'off',
										withAsterisk: true,
										required: true,
									}}
								/>
								<FormInput
									fieldProps={{
										name: 'salary',
									}}
									inputProps={{
										label: 'Зарплата',
										type: 'number',
										autoComplete: 'off',
									}}
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
		</Modal>
	)
}

export default AddGradeModal
