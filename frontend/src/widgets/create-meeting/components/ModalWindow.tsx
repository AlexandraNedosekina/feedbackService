import { Modal, Title } from '@mantine/core'

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
				{/* Modal content */}
			</Modal>
		</>
	)
}
export default ModalWindow
