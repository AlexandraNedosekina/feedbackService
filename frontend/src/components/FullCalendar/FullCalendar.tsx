import Calendar, { CalendarOptions, DateSelectArg, EventApi, EventClickArg, EventContentArg } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import 'dayjs/locale/ru';
import React, { FC } from 'react';
import { createEventId, INITIAL_EVENTS } from '../../components/FullCalendar/components/event-utils'

const FullCalendar:FC=(props: CalendarOptions)=> {

	return (
		<>
			{/* стартовая страница - календарь сотрудника, время работы подтягивается 
			с профиля, выбирает сотрудника/сотрудников, ставим время, 
			"пуш" уходит выбранным коллегам, они у себя в календаре видят встречу 
			и могут либо "Согласовать", либо "Отклонить", либо "Назначить другое время" */}
			<Calendar
				{...props}
				plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
				initialView="timeGridWeek"
				selectable={true}
				scrollTime="08:00"
				locale="ru"
				headerToolbar={{
					left: 'prev,next today',
					center: 'title',
					right: 'dayGridMonth,timeGridWeek,timeGridDay',
				}}
				nowIndicator={true}
				editable={true}
				initialEvents={INITIAL_EVENTS}
				select={handleDateSelect}
				eventContent={renderEventContent}
				eventClick={handleEventClick}
				// eventsSet={}
				businessHours={{
					daysOfWeek: [1, 2, 3, 4, 5],
					minTime: '10:00:00',
					maxTime: '23:00:00',
					startTime: '10:00',
					endTime: '18:00',
				}}
				events={[
					{
						title: 'My Event',
						start: '2010-01-01T14:30:00',
						allDay: false
					}
				]}
				eventTimeFormat={{
					hour: '2-digit',
					minute: '2-digit',
					second: '2-digit',
					hour12: false
				}}
			/>

		</>
	)
}
function handleDateSelect (selectInfo: DateSelectArg) {
    let title = prompt('Please enter a new title for your event')
    let calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      })
    }
  }
  function handleEventClick (clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove()
    }
  }

	function renderEventContent(eventContent: EventContentArg) {
		return (
			<>
				<b>{eventContent.timeText}</b>
				<i>{eventContent.event.title}</i>
			</>
		)
	}
export default FullCalendar;