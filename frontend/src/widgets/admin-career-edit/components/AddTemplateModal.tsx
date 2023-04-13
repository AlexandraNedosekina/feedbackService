import { Button, Flex, Modal, Title } from '@mantine/core'
import { CareerAddTemplate } from 'features/career-add-template'

interface IProps {
	isOpen: boolean
	onClose: () => void
}

export const AddTemplateModal = ({ isOpen, onClose }: IProps) => {
	return (
		<Modal
			opened={isOpen}
			onClose={onClose}
			title={<Title order={4}>Использовать шаблон</Title>}
			size="lg"
		>
			<CareerAddTemplate />

			<Flex justify={'end'} mt="lg">
				<Button>Сохранить</Button>
			</Flex>
		</Modal>
	)
}
