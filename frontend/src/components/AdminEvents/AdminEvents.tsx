import Icon from '@components/Icon'
import { Button, Modal, Title } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { FC, useState } from 'react'
import { getAllEvents, QueryKeys } from 'src/api'
import { CreateEventModal, EventsTable } from './components'

const AdminEvents: FC = () => {
	const [isModalOpen, setIsModalOpen] = useState(false)

	const { data, isLoading } = useQuery({
		queryKey: [QueryKeys.EVENTS],
		queryFn: getAllEvents,
	})

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
				onClose={() => setIsModalOpen(false)}
				size="lg"
			>
				<CreateEventModal onClose={() => setIsModalOpen(false)} />
			</Modal>
		</>
	)
}

export default AdminEvents
