import { Modal, Title } from '@mantine/core'

interface IProps {
	isOpen: boolean
	onClose: () => void
}

export const AddTemplateModal = ({ isOpen, onClose }: IProps) => {
	return (
		<Modal
			opened={isOpen}
			onClose={onClose}
			title={<Title order={4}>Использовать шаблон</Title>}
			size='lg'
		></Modal>
	)
}
