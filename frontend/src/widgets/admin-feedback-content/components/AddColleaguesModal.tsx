import { Modal, Title } from '@mantine/core'
import AddColleaguesModalView from './AddColleaguesModalView'

interface IProps {
	opened: boolean
	onClose: () => void
	userId: string
}

const AddColleaguesModal = ({ opened, onClose, userId }: IProps) => {
	return (
		<Modal
			title={<Title order={3}>Добавление коллег</Title>}
			opened={opened}
			onClose={onClose}
			size="lg"
		>
			<AddColleaguesModalView onClose={onClose} userId={userId} />
		</Modal>
	)
}

export default AddColleaguesModal
