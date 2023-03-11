import { showNotification } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { acceptCalendarEvent, QueryKeys } from 'shared/api'
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
			onClick={() => mutate()}
			icon="done"
			color="green"
			loading={isLoading}
			tooltipText="Подтвердить встречу"
		/>
	)
}
