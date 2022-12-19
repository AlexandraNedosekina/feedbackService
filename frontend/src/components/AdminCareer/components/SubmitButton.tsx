import { Button } from '@mantine/core'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { createCareerTrack, QueryKeys } from 'src/api'
import { CareerParamCreate, CareerTrackCreate } from 'src/api/generatedTypes'
import { useAddCareerGrade } from 'src/stores'

const SubmitButton = () => {
	const store = useAddCareerGrade()
	const {
		query: { id },
	} = useRouter()
	const queryClient = useQueryClient()
	const { mutate, isLoading } = useMutation({
		mutationFn: (data: CareerTrackCreate) => createCareerTrack(data),
		onSuccess: () => {
			queryClient.invalidateQueries([QueryKeys.CAREER_BY_USER_ID, id])
			store.restore()
		},
	})

	function handleSubmit() {
		const toLearn: CareerParamCreate[] = store.toLearn.map(item => ({
			description: item,
			type: 'to_learn',
		}))
		const toComplete: CareerParamCreate[] = store.toComplete.map(item => ({
			description: item,
			type: 'to_complete',
		}))

		const data: CareerTrackCreate = {
			user_id: +(id as string),
			name: store.title,
			salary: store.salary ?? 0,
			params: [...toLearn, ...toComplete],
		}

		mutate(data)
	}

	return (
		<Button
			sx={() => ({
				alignSelf: 'flex-end',
			})}
			onClick={handleSubmit}
			loading={isLoading}
			disabled={store.getIsDisabled()}
		>
			Добавить
		</Button>
	)
}

export default SubmitButton
