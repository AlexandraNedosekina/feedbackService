import { ActionIcon } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { acceptCalendarEvent, QueryKeys } from 'shared/api'
import { Icon } from 'shared/ui'
import ActionTemplate from './ActionTemplate'

interface IProps {
	eventId: number
}

export default function ({ eventId }: IProps) {
	const queryClient = useQueryClient()
	const { mutate, isLoading } = useMutation({
		mutationFn: () => acceptCalendarEvent(eventId),
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
			icon="schedule"
			color="brand"
			loading={isLoading}
			tooltipText="Изменить время"
		/>
	)
}
