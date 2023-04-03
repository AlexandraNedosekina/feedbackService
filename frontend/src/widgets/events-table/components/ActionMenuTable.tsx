import { useDisclosure } from '@mantine/hooks'
import { ActionMenu, Icon } from 'shared/ui'
import DeleteModal from './DeleteModal'
import EditModal from './EditModal'
import { Event } from 'shared/api/generatedTypes'

interface IProps {
	eventId: string
	event: Event
}

const ActionMenuTable = ({ eventId, event }: IProps) => {
	const [isDeleteModalOpen, deleteModalHandlers] = useDisclosure(false)
	const [isEditModalOpen, editModalHandlers] = useDisclosure(false)

	return (
		<>
			<ActionMenu>
				<ActionMenu.Item
					onClick={editModalHandlers.open}
					icon={<Icon icon="edit" />}
					color="brand"
				>
					Редактировать
				</ActionMenu.Item>
				<ActionMenu.Item
					onClick={deleteModalHandlers.open}
					icon={<Icon icon="delete" />}
					color="red"
				>
					Удалить
				</ActionMenu.Item>
			</ActionMenu>
			<DeleteModal
				isOpen={isDeleteModalOpen}
				onClose={deleteModalHandlers.close}
				eventId={eventId}
			/>
			<EditModal
				isOpen={isEditModalOpen}
				onClose={editModalHandlers.close}
				eventId={eventId}
				event={event}
			/>
		</>
	)
}

export default ActionMenuTable
