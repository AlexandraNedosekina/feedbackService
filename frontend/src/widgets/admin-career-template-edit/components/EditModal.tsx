import { Modal, Title } from '@mantine/core'
import { ICareerGradeFormValues } from 'entities/career'
import { TemplateGradeEdit } from 'features/career-grade'

interface IProps {
	isOpen: boolean
	onClose: () => void
	initialValues: ICareerGradeFormValues
	careerId: string
}

export const EditModal = ({
	isOpen,
	onClose,
	initialValues,
	careerId,
}: IProps) => {
	return (
		<Modal
			opened={isOpen}
			onClose={onClose}
			title={<Title order={4}>{'Редактирование этапа'}</Title>}
			size="lg"
		>
			<TemplateGradeEdit
				onDone={onClose}
				initialValues={initialValues}
				careerId={careerId}
			/>
		</Modal>
	)
}
