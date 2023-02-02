import { Modal, Title } from '@mantine/core'
import AddColleaguesModalView from './AddColleaguesModalView'

interface IProps {
	opened: boolean
	onClose: () => void
}

const AddColleaguesModal = ({ opened, onClose }: IProps) => {
	return (
		<Modal
			title={<Title order={3}>Добавление коллег</Title>}
			opened={opened}
			onClose={onClose}
			size="lg"
		>
			<AddColleaguesModalView onClose={onClose} />
		</Modal>
	)
}

export default AddColleaguesModal
