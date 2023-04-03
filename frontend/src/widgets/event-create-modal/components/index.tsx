import { Button, Modal, Title } from '@mantine/core'
import { EventCreate } from 'features/event-create'
import { useState } from 'react'
import { Icon } from 'shared/ui'

export default () => {
	const [isModalOpen, setIsModalOpen] = useState(false)

	function handleClose() {
		setIsModalOpen(false)
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
