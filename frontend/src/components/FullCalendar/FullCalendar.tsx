import Calendar, { CalendarOptions } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import 'dayjs/locale/ru';
import styles from './Fullcalendar.module.scss';
import { FC } from 'react';

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
				selectable="true"
				locale="ru"
				headerToolbar={{
					left: 'prev,next today',
					center: 'title',
					right: 'dayGridMonth,timeGridWeek,timeGridDay',
				}}
				nowIndicator={true}
				editable={true}
				initialEvents={[{ title: "Initial event", start: new Date() }]}
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
export default FullCalendar;