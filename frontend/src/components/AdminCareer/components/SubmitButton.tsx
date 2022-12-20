import { Button } from '@mantine/core'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { createCareerTrack, QueryKeys, updateCareerTrack } from 'src/api'
import {
	CareerParamCreate,
	CareerParamUpdate,
	CareerTrackCreate,
	CareerTrackUpdate,
} from 'src/api/generatedTypes'
import { ICareerGradeParam, useAddCareerGrade } from 'src/stores'

const SubmitButton = () => {
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
		},
	})
	const { mutate: update, isLoading: isUpdateLoading } = useMutation({
		mutationFn: (data: CareerTrackUpdate) => {
			if (!store.careerId) throw new Error('No career id')
			return updateCareerTrack(store.careerId, data)
		},
		onSuccess: () => {
			queryClient.invalidateQueries([QueryKeys.CAREER_BY_USER_ID, id])
			store.restore()
		},
	})

	function handleSubmit() {
		if (store.isEdit) {
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

			if (toLearnEdited.length > 0 || toCompleteEdited.length > 0) {
				update({
					name: store.title,
					salary: store.salary ?? 0,
					params: [...toLearnEdited, ...toCompleteEdited],
				})
			}

			update({
				name: store.title,
				salary: store.salary ?? 0,
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
			Добавить
		</Button>
	)
}

function reduceParams(
	params: ICareerGradeParam[],
	type: 'to_learn' | 'to_complete'
) {
	return params.reduce<{
		created: CareerParamCreate[]
		edited: CareerParamUpdate[]
		deleted: number[]
	}>(
		(prev, curr) => {
			if (curr.isDeleted) {
				prev.deleted.push(+curr.id)
			} else if (curr.isCreated) {
				prev.created.push({
					description: curr.text,
					type,
				})
			} else if (curr.isEdited) {
				prev.edited.push({
					id: +curr.id,
					description: curr.text,
					type,
				})
			}

			return prev
		},
		{
			created: [],
			edited: [],
			deleted: [],
		}
	)
}

export default SubmitButton
