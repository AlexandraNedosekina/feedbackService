import { Modal, Title } from '@mantine/core'
import { ICareerGradeFormValues } from 'entities/career'
import { CareerAddGrade } from 'features/career-add-grade'

interface IProps {
	isOpen: boolean
	onClose: () => void
	initialValues: ICareerGradeFormValues
}

export const EditModal = ({ isOpen, onClose, initialValues }: IProps) => {
	return (
		<Modal
			opened={isOpen}
			onClose={onClose}
			title={<Title order={4}>{'Редактирование этапа'}</Title>}
			size="lg"
		>
			<CareerAddGrade onClose={onClose} initialValues={initialValues} />
		</Modal>
	)
}
