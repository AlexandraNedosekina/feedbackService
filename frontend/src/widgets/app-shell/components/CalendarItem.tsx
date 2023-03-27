import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useUser } from 'entities/user'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { myCalendar, QueryKeys } from 'shared/api'
import { CalendarEventStatus, CalendarFormat } from 'shared/api/generatedTypes'
import NavItem from './NavItem'

export default () => {
	const router = useRouter()
	const { user } = useUser()

	const { data } = useQuery({
		queryKey: [QueryKeys.CALENDAR],
		queryFn: () =>
			myCalendar(
				dayjs(Date.now()).format('YYYY-MM-DD'),
				CalendarFormat.Month
			),
		select: data =>
			data.map(item => ({
				status: item.status,
				userId: item.user_id,
			})),
		refetchInterval: 1000 * 60 * 3, // 3 minutes
	})
	const notify = useMemo(() => {
		return data?.some(
			i =>
				(i.status === CalendarEventStatus.Pending ||
					i.status === CalendarEventStatus.Resheduled) &&
				i.userId === user.id
		)
	}, [data, user.id])

	return (
		<NavItem
			icon={'calendar_month'}
			href={'/calendar'}
			text={'Календарь встреч'}
			active={router.pathname.split('/')[1] === 'calendar'}
			notify={notify}
		/>
	)
}
