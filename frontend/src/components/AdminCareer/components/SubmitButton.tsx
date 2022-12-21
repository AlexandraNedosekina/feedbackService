import { Button } from '@mantine/core'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { createCareerTrack, QueryKeys } from 'src/api'
import { CareerParamCreate, CareerTrackCreate } from 'src/api/generatedTypes'
import { useAddCareerGrade } from 'src/stores'
import { reduceParams } from '../utils/reduceParams'
import {
	IUpdateCareerTrackAllParams,
	updateCareerTrackAll,
} from '../utils/updateCareerTrackAll'

interface Props {
	onClose: () => void
}

const SubmitButton: FC<Props> = ({ onClose }) => {
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
		},
	})

	function handleSubmit() {
		if (store.isEdit && store.careerId) {
			const {
				created: toLearnCreated,
				deleted: toLearnDeleted,
				edited: toLearnEdited,
			} = reduceParams(store.toLearn, 'to_learn')
			const {
				created: toCompleteCreated,
				deleted: toCompleteDeleted,
				edited: toCompleteEdited,
			} = reduceParams(store.toComplete, 'to_complete')

			update({
				careerId: store.careerId,
				name: store.title,
				salary: store.salary ?? 0,
				paramsToAdd: [...toLearnCreated, ...toCompleteCreated],
				paramsToDelete: [...toLearnDeleted, ...toCompleteDeleted],
				paramsToUpdate: [...toLearnEdited, ...toCompleteEdited],
			})
			return
		}

		const toLearn: CareerParamCreate[] = store.toLearn.map(item => ({
			description: item.text,
			type: 'to_learn',
		}))
		const toComplete: CareerParamCreate[] = store.toComplete.map(item => ({
			description: item.text,
			type: 'to_complete',
		}))

		const data: CareerTrackCreate = {
			user_id: +(id as string),
			name: store.title,
			salary: store.salary ?? 0,
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
			disabled={store.getIsDisabled()}
		>
			{store.isEdit ? 'Сохранить' : 'Добавить'}
		</Button>
	)
}

export default SubmitButton
