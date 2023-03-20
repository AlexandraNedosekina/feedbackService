import { Button, Flex, Modal, Text, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteCalendarById, QueryKeys } from 'shared/api'

interface IProps {
	isOpen: boolean
	onClose: () => void
	id: number
}

export default ({ onClose, isOpen, id }: IProps) => {
	const queryClient = useQueryClient()
	const { mutate, isLoading } = useMutation({
		mutationFn: () => deleteCalendarById(id),
		onSuccess: () => {
			queryClient.invalidateQueries([QueryKeys.CALENDAR])
			onClose()
			showNotification({
				title: 'Успешно',
				message: 'Событие удалено',
				color: 'green',
			})
		},
	})

	return (
		<Modal
			opened={isOpen}
			onClose={onClose}
			title={
				<Title order={4}>Вы дествительно хотите удалить событие?</Title>
			}
			zIndex={500}
		>
			<Text>Отменить действие будет невозможно</Text>

			<Flex mt="md" justify={'end'} gap="sm">
				<Button onClick={onClose} variant="outline">
					Отмена
				</Button>
				<Button onClick={() => mutate()} loading={isLoading} color="red">
					Удалить
				</Button>
			</Flex>
		</Modal>
	)
}
