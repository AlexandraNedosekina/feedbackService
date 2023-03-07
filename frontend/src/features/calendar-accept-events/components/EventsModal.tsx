import { Modal, Title } from '@mantine/core'
import { CalendarEvent } from 'shared/api/generatedTypes'
import EventItem from './EventItem'

interface IProps {
	isOpen: boolean
	onClose: () => void
	events: CalendarEvent[]
}

export default function EventsModal({ onClose, isOpen, events }: IProps) {
	return (
		<Modal
			opened={isOpen}
			onClose={onClose}
			title={<Title order={4}>Подверждения встреч</Title>}
			size="lg"
		>
			{events.map(event => (
				<EventItem key={event.id} event={event} />
			))}
		</Modal>
	)
}
