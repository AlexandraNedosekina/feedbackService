import Calendar, {
	CalendarOptions,
	DateSelectArg,
	EventClickArg,
	EventContentArg,
} from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import 'dayjs/locale/ru'
import { createEventId, INITIAL_EVENTS } from './components/event-utils'
import { CreateMeeting } from 'widgets/create-meeting'
import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { myCalendar, QueryKeys } from 'shared/api'
import dayjs from 'dayjs'
import { CalendarFormat } from 'shared/api/generatedTypes'
import { EditEventModal } from './components'
import { Box, Text } from '@mantine/core'
import { useFullcalendarStore } from './model'

const FullCalendar = (props: CalendarOptions) => {
	const [opened, setOpened] = useState(false)
	const [isEditOpen, setIsEditOpen] = useState(false)

	const update = useFullcalendarStore(state => state.update)

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
					user: item.user,
				},
			})) ?? [],
		[data]
	)

	function handleEventClick(clickInfo: EventClickArg) {
		update({
			eventForEdit: {
				id: clickInfo.event.extendedProps.id,
				start: clickInfo.event.start || new Date(),
				end: clickInfo.event.end || new Date(),
				user: clickInfo.event.extendedProps.user,
			},
		})
		setIsEditOpen(true)
	}

	return (
		<>
			{/* стартовая страница - календарь сотрудника, время работы подтягивается 
			с профиля, выбирает сотрудника/сотрудников, ставим время, 
			"пуш" уходит выбранным коллегам, они у себя в календаре видят встречу 
			и могут либо "Согласовать", либо "Отклонить", либо "Назначить другое время" */}
			<Calendar
				{...props}
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
						click: () => setOpened(true),
					},
				}}
				// initialView="timeGridWeek"
				selectable={true}
				scrollTime="08:00"
				locale="ru"
				nowIndicator={true}
				editable={true}
				initialEvents={INITIAL_EVENTS}
				select={() => setOpened(true)}
				eventContent={renderEventContent}
				eventClick={handleEventClick}
				// eventsSet={handleEvents}
				// eventAdd={function(){}}
				// eventChange={function(){}}
				// eventRemove={function(){}}
				businessHours={{
					daysOfWeek: [1, 2, 3, 4, 5],
					minTime: '10:00:00',
					maxTime: '23:00:00',
					startTime: '10:00',
					endTime: '18:00',
				}}
				events={mappedData}
				eventTimeFormat={{
					hour: '2-digit',
					minute: '2-digit',
					second: '2-digit',
					hour12: false,
				}}
				firstDay={1}
			/>
			<CreateMeeting opened={opened} onClose={() => setOpened(false)} />
			<EditEventModal
				isOpen={isEditOpen}
				onClose={() => setIsEditOpen(false)}
			/>
		</>
	)

	// function isCreateEventModalOpen(selectInfo) {
	// 	const calendarApi = selectInfo.view.calendar;
	// 	ModalWindow();

	// 	const title = prompt("Please enter a new title for your event");
	// 	calendarApi.unselect(); // clear date selection

	// 	if (title) {
	// 		calendarApi.addEvent(
	// 			{
	// 				title,
	// 				start: selectInfo.startStr,
	// 				end: selectInfo.endStr,
	// 				allDay: selectInfo.allDay,
	// 			},
	// 			true
	// 		)
	// 	}
	// }

	function handleDateSelect(selectInfo: DateSelectArg) {
		const title = prompt('Введите название события')
		const calendarApi = selectInfo.view.calendar

		calendarApi.unselect()

		if (title) {
			calendarApi.addEvent({
				id: createEventId(),
				title,
				start: selectInfo.startStr,
				end: selectInfo.endStr,
				allDay: selectInfo.allDay,
			})
		}
	}

	function handleEventCreate() {
		const dateStr = prompt('Введите дату в формате ГГГГ-ММ-ДД')
		const date = new Date(dateStr + 'T00:00:00')
		if (!isNaN(date.valueOf())) {
			// FullCalendar.bind({
			// 	title: title,
			// 	start: date,
			// 	allDay: true,
			// })
			alert('Great. Now, update your database...')
		} else {
			alert('Invalid date.')
		}
	}
}

function renderEventContent(eventContent: EventContentArg) {
	return (
		<Box>
			<Text weight="bolder">{eventContent.timeText}</Text>
			<Text>{eventContent.event.title}</Text>
		</Box>
	)
}
export default FullCalendar
