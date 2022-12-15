import { FC, useState } from 'react'
import { ActionMenu } from '@components/Table'
import Icon from '@components/Icon'
import { Button, Flex, Modal, Title } from '@mantine/core'

interface Props {
	colleagueId: string
}

const ActionMenuTable: FC<Props> = ({ colleagueId }) => {
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

	// const queryClient = useQueryClient()

	// const { mutate, isLoading } = useMutation({
	// 	mutationFn: (eventId: string) => deleteEvent(eventId),
	// 	onSuccess: () => {
	// 		queryClient.invalidateQueries([QueryKeys.EVENTS])
	// 		setIsDeleteModalOpen(false)
	// 	},
	// })

	function handleDelete() {
		// mutate(eventId)
	}

	return (
		<>
			<ActionMenu>
				<ActionMenu.Item
					onClick={() => setIsDeleteModalOpen(true)}
					icon={<Icon icon="delete" />}
					color="red"
				>
					Удалить
				</ActionMenu.Item>
			</ActionMenu>
			<Modal
				title={<Title order={4}>Удаление</Title>}
				opened={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
			>
				<div>
					Вы дейстительно хотите удалить этого сотрудника из коллег?
				</div>

				<Flex justify={'flex-end'}>
					<Button
						onClick={handleDelete}
						// loading={isLoading}
						color="red"
						variant="outline"
						mt="md"
					>
						Удалить
					</Button>
					<Button
						onClick={() => setIsDeleteModalOpen(false)}
						color="brand"
						mt="md"
						ml="md"
					>
						Отмена
					</Button>
				</Flex>
			</Modal>
		</>
	)
}

export default ActionMenuTable
