import { Button } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { useFormState } from 'react-final-form'
import { createCareerTrack, QueryKeys } from 'src/api'
import { CareerParamCreate, CareerTrackCreate } from 'src/api/generatedTypes'
import { useAddCareerGrade } from 'src/stores'
import { IFormValues } from '../types'
import { reduceParams } from '../utils/reduceParams'
import {
	IUpdateCareerTrackAllParams,
	updateCareerTrackAll,
} from '../utils/updateCareerTrackAll'

interface Props {
	onClose: () => void
}

const SubmitButton: FC<Props> = ({ onClose }) => {
	const {
		dirtyFields,
		values,
		submitting,
		pristine,
		invalid,
		hasValidationErrors,
	} = useFormState<IFormValues>()
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

	function handleSubmit() {
		if (store.isEdit && store.careerId) {
			const { created: toLearnCreated, updated: toLearnUpdated } =
				reduceParams(dirtyFields, values.toLearn, 'to_learn')
			const { created: toCompleteCreated, updated: toCompleteUpdated } =
				reduceParams(dirtyFields, values.toComplete, 'to_complete')

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
		const toComplete: CareerParamCreate[] = values.toComplete.map(item => ({
			description: item.text,
			type: 'to_complete',
		}))

		const data: CareerTrackCreate = {
			user_id: +(id as string),
			name: values.title,
			salary: +values.salary ?? 0,
			params: [...toLearn, ...toComplete],
		}

		create(data)
	}

	return (
		<Button
			sx={() => ({
				alignSelf: 'flex-end',
			})}
			onClick={handleSubmit}
			loading={isCreateLoading || isUpdateLoading}
			disabled={pristine || invalid || hasValidationErrors || submitting}
		>
			{store.isEdit ? 'Сохранить' : 'Добавить'}
		</Button>
	)
}

export default SubmitButton
