import { Modal, Stack, Title } from '@mantine/core'
import { FC } from 'react'
import { useAddCareerGrade } from 'src/stores'
import SalaryInput from './SalaryInput'
import SubmitButton from './SubmitButton'
import Tasks from './Tasks'
import TitleInput from './TitleInput'

interface Props {
	isOpen: boolean
	onClose: () => void
}

const AddGradeModal: FC<Props> = ({ isOpen, onClose }) => {
	const isEdit = useAddCareerGrade(state => state.isEdit)

	return (
		<Modal
			opened={isOpen}
			onClose={onClose}
			title={
				<Title order={4}>
					{isEdit ? 'Редактирование этапа' : 'Создание этапа'}
				</Title>
			}
			size="lg"
		>
			<Stack>
				<TitleInput />
				<SalaryInput />
				<Tasks title="Что нужно изучить" type="toLearn" />
				<Tasks title="Что нужно сделать" type="toComplete" />
				<SubmitButton onClose={onClose} />
			</Stack>
		</Modal>
	)
}

export default AddGradeModal
