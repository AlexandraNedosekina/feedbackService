import { Button, Group } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { createFeedback, QueryKeys } from 'src/api'
import { FeedbackFromUser } from 'src/api/generatedTypes'
import { useFeedbackStore } from 'src/stores'

export const Buttons = () => {
	const {
		query: { feedbackId },
	} = useRouter()
	const router = useRouter()
	const queryClient = useQueryClient()

	const { update, ...feedbackStore } = useFeedbackStore()

	const requiredFields: Pick<
		FeedbackFromUser,
		'interaction' | 'involvement' | 'motivation' | 'task_completion'
	> = useMemo(
		() => ({
			interaction: feedbackStore.interaction,
			involvement: feedbackStore.involvement,
			motivation: feedbackStore.motivation,
			task_completion: feedbackStore.task_completion,
		}),
		[
			feedbackStore.interaction,
			feedbackStore.involvement,
			feedbackStore.motivation,
			feedbackStore.task_completion,
		]
	)
	const isDisabled: boolean = useMemo(
		() => Object.values(requiredFields).some(value => !value),
		[requiredFields]
	)

	function goToEmpty() {
		router.push('/feedback/')
	}

	const { mutate, isLoading } = useMutation({
		mutationFn: (data: FeedbackFromUser) =>
			createFeedback(+(feedbackId as string), data),
		onSuccess: data => {
			queryClient.invalidateQueries([QueryKeys.FEEDBACK, data.id])
			queryClient.invalidateQueries([QueryKeys.FEEDBACK_LIST])

			showNotification({
				title: 'Успешно',
				message: 'Обратная связь отправлена',
				color: 'green',
			})
		},
	})

	return (
		<Group>
			<Button
				disabled={isDisabled}
				loading={isLoading}
				onClick={() => mutate(feedbackStore)}
			>
				Сохранить
			</Button>
			<Button
				variant="outline"
				style={{ background: 'white' }}
				onClick={goToEmpty}
			>
				Отмена
			</Button>
		</Group>
	)
}
