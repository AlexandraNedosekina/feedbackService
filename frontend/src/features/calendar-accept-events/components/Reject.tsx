import { ActionIcon } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { acceptCalendarEvent, QueryKeys, rejectCalendarEvent } from 'shared/api'
import { Icon } from 'shared/ui'
import ActionTemplate from './ActionTemplate'

interface IProps {
	eventId: number
}

export default function ({ eventId }: IProps) {
	const queryClient = useQueryClient()
	const { mutate, isLoading } = useMutation({
		mutationFn: () =>
			rejectCalendarEvent(eventId, { rejection_cause: undefined }),
		onSuccess: () => {
			showNotification({
				title: 'Успешно',
				message: 'Встреча подтверждена',
				color: 'green',
			})
			queryClient.invalidateQueries([QueryKeys.CALENDAR])
		},
	})

	return (
		<ActionTemplate
			icon="close"
			color="red"
			loading={isLoading}
			tooltipText="Отменить встречу"
		/>
	)
}
