import { Button } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useUser } from 'entities/user'
import { useMemo } from 'react'
import { myCalendar, QueryKeys } from 'shared/api'
import { CalendarEventStatus, CalendarFormat } from 'shared/api/generatedTypes'
import EventsModal from './EventsModal'

export default function () {
	const [isOpen, handlers] = useDisclosure(false)
	const { user } = useUser()

	const { data, isLoading } = useQuery({
		queryKey: [QueryKeys.CALENDAR],
		queryFn: () =>
			myCalendar(
				dayjs(Date.now()).format('YYYY-MM-DD'),
				CalendarFormat.Month
			),
		refetchInterval: 1000 * 3,
	})
	const pendingEvents = useMemo(() => {
		return data?.filter(
			i => i.status === CalendarEventStatus.Pending && i.user_id === user.id
		)
	}, [data, user.id])

	if (pendingEvents?.length === 0 || isLoading || !pendingEvents) return null

	return (
		<>
			<Button variant="outline" onClick={handlers.open}>
				Подтверждения встреч ({pendingEvents?.length})
			</Button>
			<EventsModal
				isOpen={isOpen}
				onClose={handlers.close}
				events={pendingEvents}
			/>
		</>
	)
}
