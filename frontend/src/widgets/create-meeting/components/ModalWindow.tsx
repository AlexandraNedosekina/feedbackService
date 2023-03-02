import { Modal, Title } from '@mantine/core'
import ModalWindowContent from './ModalWindowContent'

interface IProps {
	opened: boolean
	onClose: () => void
}

const ModalWindow = ({ opened, onClose }: IProps) => {
	return (
		<>
			<Modal
				title={<Title order={3}>Создание встречи</Title>}
				opened={opened}
				onClose={onClose}
				size="lg"
			>
				<ModalWindowContent onClose={onClose} />
			</Modal>
		</>
	)
}
export default ModalWindow
