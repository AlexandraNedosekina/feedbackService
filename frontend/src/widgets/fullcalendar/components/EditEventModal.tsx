import { Modal, Text } from '@mantine/core'

interface IProps {
	isOpen: boolean
	onClose: () => void
}

const EditEventModal = ({ isOpen, onClose }: IProps) => {
	return (
		<Modal opened={isOpen} onClose={onClose} size="md" title="hey">
			<Text>Редактирование события</Text>
		</Modal>
	)
}

export default EditEventModal
