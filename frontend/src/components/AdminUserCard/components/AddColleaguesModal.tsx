import { Modal, Title } from '@mantine/core'
import { FC } from 'react'
import AddColleaguesModalView from './AddColleaguesModalView'

interface Props {
	opened: boolean
	onClose: () => void
}

const AddColleaguesModal: FC<Props> = ({ opened, onClose }) => {
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
