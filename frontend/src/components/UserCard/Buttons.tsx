import { Button, Group } from '@mantine/core'
import { useMutation } from '@tanstack/react-query'
import router from 'next/router'
import { useMemo } from 'react'
import { createFeedback } from 'src/api'
import { FeedbackFromUser } from 'src/api/generatedTypes'
import { useFeedbackStore } from 'src/stores'

export const Buttons = () => {
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
		() => Object.values(requiredFields).some(value => value === 0),
		[requiredFields]
	)

	function goToEmpty() {
		router.push('/feedback/')
	}

	const { mutate, isLoading } = useMutation({
		mutationFn: (data: FeedbackFromUser) => createFeedback(1, data),
	})

	return (
		<Group>
			<Button disabled={isDisabled} loading={isLoading}>
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
