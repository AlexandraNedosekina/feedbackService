import { Modal, Text, Title } from '@mantine/core'
import { useEffect } from 'react'
import { CalendarEvent } from 'shared/api/generatedTypes'
import EventItem from './EventItem'

interface IProps {
	isOpen: boolean
	onClose: () => void
	events: CalendarEvent[]
}

export default function EventsModal({ onClose, isOpen, events }: IProps) {
	useEffect(() => {
		if (events.length === 0) onClose()
	}, [events.length, onClose])

	return (
		<Modal
			opened={isOpen}
			onClose={onClose}
			title={<Title order={4}>Подверждения встреч</Title>}
			size="lg"
		>
			{events.length !== 0 ? (
				events.map(event => <EventItem key={event.id} event={event} />)
			) : (
				<Text>Пусто</Text>
			)}
		</Modal>
	)
}
