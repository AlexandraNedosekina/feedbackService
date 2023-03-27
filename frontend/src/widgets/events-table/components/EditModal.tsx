import { Button, Flex, Modal, Title } from '@mantine/core'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QueryKeys, updateEvent } from 'shared/api'
import { EventUpdate } from 'shared/api/generatedTypes'

interface IProps {
	isOpen: boolean
	onClose: () => void
	eventId: string
}

export default ({ isOpen, onClose, eventId }: IProps) => {
	const queryClient = useQueryClient()

	const { mutate, isLoading } = useMutation({
		mutationFn: (eventId: string, data: EventUpdate) =>
			updateEvent(eventId, data),
		onSuccess: () => {
			queryClient.invalidateQueries([QueryKeys.EVENTS])
			onClose()
		},
	})

	function handleUpdate() {
		mutate(eventId)
	}

	return (
		<Modal
			title={<Title order={4}>Редактирование сбора обратной связи</Title>}
			opened={isOpen}
			onClose={onClose}
		>
			<div>Вы дейстительно хотите удалить этот сбор обратной связи?</div>

			<Flex justify={'flex-end'}>
				<Button
					onClick={handleUpdate}
					loading={isLoading}
					color="red"
					variant="outline"
					mt="md"
				>
					Удалить
				</Button>
				<Button onClick={onClose} color="brand" mt="md" ml="md">
					Отмена
				</Button>
			</Flex>
		</Modal>
	)
}
