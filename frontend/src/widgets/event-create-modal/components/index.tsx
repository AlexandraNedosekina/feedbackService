import { Button, Modal, Title } from '@mantine/core'
import { createEventModel, EventCreate } from 'features/event-create'
import { useState } from 'react'
import { Icon } from 'shared/ui'

export default () => {
	const restore = createEventModel.useCreateEventStore(state => state.restore)
	const [isModalOpen, setIsModalOpen] = useState(false)

	function handleClose() {
		setIsModalOpen(false)
		restore()
	}

	return (
		<>
			<Button
				leftIcon={<Icon icon="add" />}
				mt="lg"
				onClick={() => setIsModalOpen(true)}
			>
				Создать
			</Button>

			<Modal
				title={<Title order={4}>Создание сбора обратной связи</Title>}
				opened={isModalOpen}
				onClose={handleClose}
				size="lg"
			>
				<EventCreate onCancel={handleClose} />
			</Modal>
		</>
	)
}
