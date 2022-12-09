import { ActionIcon, Button, Flex, Menu, Modal, Title } from '@mantine/core'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import { deleteEvent, QueryKeys } from 'src/api'
import Icon from '@components/Icon'
import { FC, useState } from 'react'

interface Props {
	eventId: string
}

const ActionMenuTable: FC<Props> = ({ eventId }) => {
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

	const queryClient = useQueryClient()

	const { mutate, isLoading } = useMutation({
		mutationFn: (eventId: string) => deleteEvent(eventId),
		onSuccess: () => {
			queryClient.invalidateQueries([QueryKeys.EVENTS])
		},
	})

	function handleDelete() {
		mutate(eventId)
	}

	return (
		<>
			<Menu position="bottom-end">
				<Menu.Target>
					<Flex justify={'flex-end'}>
						<ActionIcon color={'brand'}>
							<Image src={'/menu.svg'} width={24} height={24} alt="" />
						</ActionIcon>
					</Flex>
				</Menu.Target>
				<Menu.Dropdown>
					<Menu.Item
						onClick={() => setIsDeleteModalOpen(true)}
						icon={<Icon icon="delete" />}
						color="red"
					>
						Удалить
					</Menu.Item>
				</Menu.Dropdown>
			</Menu>
			<Modal
				title={<Title order={4}>Удаление сбора обратной связи</Title>}
				opened={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
			>
				<div>Вы дейстительно хотите удалить этот сбор обратной связи?</div>

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
