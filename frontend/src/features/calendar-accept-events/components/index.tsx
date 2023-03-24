import { Indicator } from '@mantine/core'
import { ActionIcon } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useUser } from 'entities/user'
import { useMemo } from 'react'
import { myCalendar, QueryKeys } from 'shared/api'
import { CalendarEventStatus, CalendarFormat } from 'shared/api/generatedTypes'
import { Icon } from 'shared/ui'
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
		refetchInterval: 1000 * 60 * 3, // 3 minutes
	})
	const pendingEvents = useMemo(() => {
		return data?.filter(
			i =>
				(i.status === CalendarEventStatus.Pending ||
					i.status === CalendarEventStatus.Resheduled) &&
				i.user_id === user.id
		)
	}, [data, user.id])

	if (pendingEvents?.length === 0 || isLoading || !pendingEvents) return null

	return (
		<>
			<Indicator
				disabled={pendingEvents.length === 0}
				label={pendingEvents.length}
				size={18}
				inline
				color="brand.8"
				zIndex={2}
			>
				<ActionIcon
					variant="filled"
					color="brand"
					size="lg"
					onClick={handlers.open}
				>
					<Icon icon="calendar_month" size={20} />
				</ActionIcon>
			</Indicator>
			<EventsModal
				isOpen={isOpen}
				onClose={handlers.close}
				events={pendingEvents}
			/>
		</>
	)
}
