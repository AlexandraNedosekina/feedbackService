import Calendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import 'dayjs/locale/ru'
import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { myCalendar, QueryKeys } from 'shared/api'
import dayjs from 'dayjs'
import { CalendarFormat } from 'shared/api/generatedTypes'
import { CreateEventModal, Event, Header } from './components'
import { useDisclosure } from '@mantine/hooks'
import { useUser } from 'entities/user'

const FullCalendar = () => {
	const [isCreateModalOpen, createModalHandlers] = useDisclosure(false, {
		onOpen: () => {
			setSelectedDate(undefined)
		},
	})
	const [selectedDate, setSelectedDate] = useState<Date>()
	const [calendarRef, setCalendarRef] = useState<Calendar | null>(null)

	const { data } = useQuery({
		queryKey: [QueryKeys.CALENDAR],
		queryFn: () =>
			myCalendar(
				dayjs(Date.now()).format('YYYY-MM-DD'),
				CalendarFormat.Month
			),
	})
	const mappedData = useMemo(
		() =>
			data?.map(item => ({
				title: item.title,
				start: item.date_start,
				end: item.date_end,
				extendedProps: {
					id: item.id,
					ownerId: item.owner_id,
					owner: item.owner,
					user: item.user,
					status: item.status,
					desc: item.description,
					cause: item.rejection_cause,
				},
			})) ?? [],
		[data]
	)
	const { user } = useUser()
	const start = user?.work_hours_start || '09:00'
	const end = user?.work_hours_end || '18:00'

	return (
		<>
			<Header
				calendar={calendarRef}
				openCreateModal={createModalHandlers.open}
			/>
			<Calendar
				ref={ref => {
					setCalendarRef(ref)
				}}
				eventStartEditable={false}
				plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
				headerToolbar={false}
				buttonText={{
					today: 'Сегодня',
					month: 'Месяц',
					week: 'Неделя',
					day: 'День',
				}}
				customButtons={{
					createEventButton: {
						text: '+',
						click: function () {
							createModalHandlers.open()
							setSelectedDate(undefined)
						},
					},
				}}
				selectable={true}
				scrollTime="08:00"
				locale="ru"
				nowIndicator={true}
				editable={true}
				select={value => {
					createModalHandlers.open()
					setSelectedDate(value.start)
				}}
				eventContent={props => <Event {...props} />}
				businessHours={{
					daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
					startTime: start,
					endTime: end,
				}}
				events={mappedData}
				eventTimeFormat={{
					hour: '2-digit',
					minute: '2-digit',
					hour12: false,
				}}
				firstDay={1}
				height="100%"
			/>
			<CreateEventModal
				opened={isCreateModalOpen}
				onClose={createModalHandlers.close}
				selectedDate={selectedDate}
			/>
		</>
	)
}

export default FullCalendar
