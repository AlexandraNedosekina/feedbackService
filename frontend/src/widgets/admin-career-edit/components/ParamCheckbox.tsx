import { Checkbox } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import produce from 'immer'
import { useRouter } from 'next/router'
import { ChangeEvent, useState } from 'react'
import { QueryKeys, TCareerAdapter, updateCareerTrack } from 'shared/api'
import { CareerTrackUpdate } from 'shared/api/generatedTypes'

interface IProps {
	isCompleted: boolean
	label: string
	id: number
	careerId: string
	type: 'toLearn' | 'toComplete'
}

const ParamCheckbox = ({ isCompleted, label, id, careerId, type }: IProps) => {
	const [isChecked, setIsChecked] = useState(isCompleted)
	const queryClient = useQueryClient()
	const {
		query: { id: userId },
	} = useRouter()
	const { mutate: update } = useMutation({
		mutationFn: (data: CareerTrackUpdate) =>
			updateCareerTrack(careerId, data),
		onMutate: async data => {
			const queryKey = [QueryKeys.CAREER_BY_USER_ID, userId]
			await queryClient.cancelQueries({ queryKey })

			const prev = queryClient.getQueryData<TCareerAdapter[]>(queryKey)

			queryClient.setQueryData<TCareerAdapter[]>(queryKey, old => {
				if (!old) return undefined

				const careerIndex = old.findIndex(i => i.id === +careerId)
				const updatedOld = produce(old, draft => {
					if (!data.params) return

					const trackIndex = draft[careerIndex][type].findIndex(
						i => i.id === id
					)
					draft[careerIndex][type][trackIndex].is_completed =
						data.params[0].is_completed ?? false
				})

				return updatedOld
			})

			return { prev }
		},
		onError: (error, __, context: any) => {
			queryClient.setQueryData(
				[QueryKeys.CAREER_BY_USER_ID, userId],
				context.prev
			)
			if (error instanceof Error) {
				showNotification({
					title: 'Ошибка',
					message: error.message,
					color: 'red',
				})
			}
			setIsChecked(prev => !prev)
		},
		onSettled: () => {
			queryClient.invalidateQueries([QueryKeys.CAREER_BY_USER_ID, userId])
			showNotification({
				title: 'Успешно',
				message: 'Данные успешно обновлены',
				color: 'green',
			})
		},
	})

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		update({
			params: [
				{
					id,
					is_completed: e.currentTarget.checked,
				},
			],
		})
		setIsChecked(e.currentTarget.checked)
	}

	return (
		<Checkbox
			label={label}
			checked={isChecked}
			onChange={handleChange}
			mt="xs"
			ml="sm"
		/>
	)
}

export default ParamCheckbox
