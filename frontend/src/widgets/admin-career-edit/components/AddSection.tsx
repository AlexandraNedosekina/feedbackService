import { ActionIcon, Menu } from '@mantine/core'
import { Icon } from 'shared/ui'

interface IProps {
	openAddGradeModal: () => void
	openAddTemplateModal: () => void
}

export const AddSection = ({ openAddGradeModal, openAddTemplateModal }: IProps) => {
	return (
		<Menu position="bottom-end">
			<Menu.Target>
				<ActionIcon variant="light" color="brand.6" size="lg">
					<Icon icon="add" size={22} />
				</ActionIcon>
			</Menu.Target>
			<Menu.Dropdown>
				<Menu.Item onClick={openAddGradeModal}>Добавить этап</Menu.Item>
				<Menu.Item onClick={openAddTemplateModal}>Использовать шаблон</Menu.Item>
			</Menu.Dropdown>
		</Menu>
	)
}
