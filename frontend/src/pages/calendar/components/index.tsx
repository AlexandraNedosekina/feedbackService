import { Space } from '@mantine/core'
import { Container } from '@mantine/core'
import { CalendarAcceptEvents } from 'features/calendar-accept-events'
import dynamic from 'next/dynamic'
import styles from './styles.module.sass'

const FullCalendar = dynamic(() => import('widgets/fullcalendar'), {
	ssr: false,
})

export default () => {
	return (
		<Container size="xl" py="lg">
			<CalendarAcceptEvents />
			<Space h="md" />
			<FullCalendar />
		</Container>
	)
}
