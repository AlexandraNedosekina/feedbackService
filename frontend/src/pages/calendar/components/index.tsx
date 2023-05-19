import { Container } from '@mantine/core'
import dynamic from 'next/dynamic'
import styles from './styles.module.sass'

const FullCalendar = dynamic(() => import('widgets/fullcalendar'), {
	ssr: false,
})

export default () => {
	return (
		<Container size="xl" py="sm" className={styles.wrapper}>
			<FullCalendar />
		</Container>
	)
}
