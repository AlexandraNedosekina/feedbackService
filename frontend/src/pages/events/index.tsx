import { Container, Title } from '@mantine/core'
import { EventCreateModal } from 'widgets/event-create-modal'
import { EventsTable } from 'widgets/events-table'

export const EventsPage = () => {
	return (
		<Container mt="lg">
			<Title order={2}>Сбор обратной связи</Title>
			<EventCreateModal />
			<EventsTable />
		</Container>
	)
}
