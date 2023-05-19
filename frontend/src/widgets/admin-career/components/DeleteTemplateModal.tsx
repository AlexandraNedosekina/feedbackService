import { Button, Flex, Modal, Text } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QueryKeys, deleteCareerTemplate } from 'shared/api'

interface IProps {
	templateId: number | undefined
	isOpen: boolean
	onClose: () => void
}

export default function DeleteTemplateModal({
	templateId,
	isOpen,
	onClose,
}: IProps) {
	const queryClient = useQueryClient()
	const { mutate, isLoading } = useMutation({
		mutationFn: (templateId: number) => deleteCareerTemplate(templateId),
		onSuccess: () => {
			queryClient.invalidateQueries([QueryKeys.CAREER_TEMPLATES])
			showNotification({
				message: 'Успешно',
				color: 'green',
			})
			onClose()
		},
	})

	if (!templateId) return null

	return (
		<Modal opened={isOpen} onClose={onClose} title="Удаление шаблона">
			<Text>
				Вы действительно хотите удалить шаблон? Отменить это действие будет
				невозможно
			</Text>

			<Flex justify={'end'} mt="lg" gap="md">
				<Button
					color="red"
					onClick={() => mutate(templateId)}
					loading={isLoading}
				>
					Удалить
				</Button>
				<Button onClick={onClose}>Отмена</Button>
			</Flex>
		</Modal>
	)
}
