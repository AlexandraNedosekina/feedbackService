import Calendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import 'dayjs/locale/ru'
import { useState, useMemo, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { myCalendar, QueryKeys } from 'shared/api'
import dayjs from 'dayjs'
import { CalendarFormat } from 'shared/api/generatedTypes'
import { EditEventModal } from './components'
import Event from './components/Event'
import CreateEventModal from './components/CreateEventModal'

const FullCalendar = () => {
	const [opened, setOpened] = useState(false)
	const [isEditOpen, setIsEditOpen] = useState(false)
	const calendarRef = useRef<Calendar>(null)

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
					user: item.user,
					status: item.status,
					desc: item.description,
				},
			})) ?? [],
		[data]
	)

	return (
		<>
			<Calendar
				ref={calendarRef}
				plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
				headerToolbar={{
					left: 'prev,next today createEventButton',
					center: 'title',
					right: 'dayGridMonth,timeGridWeek,timeGridDay',
				}}
				buttonText={{
					today: 'Сегодня',
					month: 'Месяц',
					week: 'Неделя',
					day: 'День',
				}}
				customButtons={{
					createEventButton: {
						text: 'Создать событие',
						click: function () {
							setOpened(true)
						},
					},
				}}
				selectable={true}
				scrollTime="08:00"
				locale="ru"
				nowIndicator={true}
				editable={true}
				select={() => setOpened(true)}
				eventContent={props => <Event {...props} />}
				businessHours={{
					daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
					//minTime: '10:00:00',
					//maxTime: '23:00:00',
					//startTime: '10:00',
					//endTime: '18:00',
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
			<CreateEventModal opened={opened} onClose={() => setOpened(false)} />
			<EditEventModal
				isOpen={isEditOpen}
				onClose={() => setIsEditOpen(false)}
			/>
		</>
	)
}

export default FullCalendar
