import { CalendarAcceptEvents } from 'features/calendar-accept-events'
import dynamic from 'next/dynamic'
import styles from './styles.module.sass'

const FullCalendar = dynamic(() => import('widgets/fullcalendar'), {
	ssr: false,
})

export default () => {
	return (
		<div className={styles.wrapper}>
			<CalendarAcceptEvents />
			<FullCalendar />
		</div>
	)
}
