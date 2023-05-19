import { Modal, Title } from '@mantine/core'
import { ICareerGradeFormValues } from 'entities/career'
import { TemplateGradeEdit } from 'features/career-grade'

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
			<TemplateGradeEdit onDone={onClose} initialValues={initialValues} />
		</Modal>
	)
}
