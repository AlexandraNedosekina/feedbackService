import { Modal, Title } from '@mantine/core'
import { CareerAddTemplate } from 'features/career-add-template'

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
			size="lg"
		>
			<CareerAddTemplate onDone={onClose} />
		</Modal>
	)
}
