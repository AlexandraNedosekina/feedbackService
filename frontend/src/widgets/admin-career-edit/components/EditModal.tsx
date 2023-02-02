import { Modal, Title } from '@mantine/core'
import { careerModel, ICareerGradeFormValues } from 'entities/career'
import { CareerAddGrade } from 'features/career-add-grade'

interface IProps {
	isOpen: boolean
	onClose: () => void
	initialValues?: ICareerGradeFormValues
}

export const EditModal = ({ isOpen, onClose, initialValues }: IProps) => {
	const isEdit = careerModel.useEditGrade(store => store.isEdit)

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
			<CareerAddGrade onClose={onClose} initialValues={initialValues} />
		</Modal>
	)
}
