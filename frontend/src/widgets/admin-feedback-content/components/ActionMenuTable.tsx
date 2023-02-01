import { Button, Flex, Modal, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { feedbackModel } from 'entities/feedback'
import { useState } from 'react'
import { deleteUsersColleagues, QueryKeys } from 'shared/api'
import { ActionMenu, Icon } from 'shared/ui'
import shallow from 'zustand/shallow'

interface IProps {
	colleagueId: number
}

const ActionMenuTable = ({ colleagueId }: IProps) => {
	const { eventId, userId } = feedbackModel.useAdminFeedbackStore(
		state => ({
			eventId: state.eventId,
			userId: state.userId,
		}),
		shallow
	)
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

	const queryClient = useQueryClient()

	const { mutate, isLoading } = useMutation({
		mutationFn: () => deleteUsersColleagues(+userId, new Set([colleagueId])),
		onSuccess: () => {
			queryClient.invalidateQueries([
				QueryKeys.FEEDBACK_STATS,
				userId,
				eventId,
			])
			setIsDeleteModalOpen(false)
			showNotification({
				title: 'Успешно',
				message: 'Коллега удален',
				color: 'green',
			})
		},
	})

	function handleDelete() {
		mutate()
	}

	return (
		<>
			<ActionMenu>
				<ActionMenu.Item
					onClick={() => setIsDeleteModalOpen(true)}
					icon={<Icon icon="delete" />}
					color="red"
				>
					Удалить коллегу
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
						loading={isLoading}
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
