import { Icon } from 'shared/ui'
import { Button, Modal, Title } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { FC, useState } from 'react'
import { getAllEvents, QueryKeys } from 'shared/api'
import { useCreateEventStore } from 'stores'
import { CreateEventModal, EventsTable } from './components'

const AdminEvents: FC = () => {
	const restore = useCreateEventStore(state => state.restore)

	const [isModalOpen, setIsModalOpen] = useState(false)

	const { data, isLoading } = useQuery({
		queryKey: [QueryKeys.EVENTS],
		queryFn: getAllEvents,
	})

	function handleClose() {
		setIsModalOpen(false)
		restore()
	}

	if (isLoading) return <div>Загрузка...</div>

	return (
		<>
			<Button
				leftIcon={<Icon icon="add" />}
				mt="lg"
				onClick={() => setIsModalOpen(true)}
			>
				Создать
			</Button>
			<EventsTable data={data || []} />

			<Modal
				title={<Title order={4}>Создание сбора обратной связи</Title>}
				opened={isModalOpen}
				onClose={handleClose}
				size="lg"
			>
				<CreateEventModal onClose={handleClose} />
			</Modal>
		</>
	)
}

export default AdminEvents
