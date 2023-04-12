import { Button, Group, Menu, Modal, Text } from '@mantine/core'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { careerModel } from 'entities/career'
import { useRouter } from 'next/router'
import { QueryKeys } from 'shared/api'
import { GradeCard as GradeCardBase } from 'entities/career'
import { Icon } from 'shared/ui'
import { useDisclosure } from '@mantine/hooks'
import { EditModal } from './EditModal'
import { CareerTemplate } from 'shared/api/generatedTypes'
import { templateGradeLib } from 'features/career-grade'
import { showNotification } from '@mantine/notifications'

const GradeCard = () => {
	const {
		query: { id },
	} = useRouter()
	const queryClient = useQueryClient()
	const selectedGradeId = careerModel.useEdit(state => state.selectedGradeId)

	const data = queryClient.getQueryData<CareerTemplate>([
		QueryKeys.CAREER_TEMPLATE_BY_ID,
		id,
	])
	const grade = data?.template[+selectedGradeId]

	const [isDeleteModalOpen, handleDeleteModal] = useDisclosure(false)
	const [isEditModalOpen, handleEditModal] = useDisclosure(false)

	const { mutate: deleteGrade, isLoading: isDeleteGradeLoading } = useMutation(
		{
			mutationFn: () => templateGradeLib.deleteGrade(),
			onSuccess: () => {
				queryClient.invalidateQueries([QueryKeys.CAREER_TEMPLATE_BY_ID, id])
				handleDeleteModal.close()
				showNotification({
					message: 'Этап успешно удален',
					color: 'green'
				})
			},
		}
	)

	function handleEdit() {
		handleEditModal.open()
	}

	function handleDelete() {
		deleteGrade()
	}

	if (!grade) return null

	return (
		<GradeCardBase
			menuItems={
				<>
					<Menu.Item
						onClick={handleEdit}
						icon={<Icon icon="edit" />}
						color="brand"
					>
						Редактировать
					</Menu.Item>
					<Menu.Item
						onClick={handleDeleteModal.open}
						icon={<Icon icon="delete" />}
						color="red"
					>
						Удалить
					</Menu.Item>
				</>
			}
			title={grade.name || 'Не задано'}
			salary={grade.salary}
		>
			<Text mt="sm">Что нужно изучить:</Text>
			{grade.params.map((item, i) => {
				if (item.type !== 'to_learn') return
				return <p key={i}>{item.description}</p>
			})}
			<Text mt="sm">Что нужно сделать:</Text>
			{grade.params.map((item, i) => {
				if (item.type !== 'to_complete') return
				return <p key={i}>{item.description}</p>
			})}

			<Modal
				title="Удалить трек?"
				opened={isDeleteModalOpen}
				onClose={handleDeleteModal.close}
			>
				<Text>Вы уверены, что хотите удалить этот трек?</Text>
				<Group position="right" mt="md">
					<Button
						variant="outline"
						color="red"
						onClick={handleDelete}
						disabled={isDeleteGradeLoading}
					>
						Удалить
					</Button>
					<Button onClick={handleDeleteModal.close}>Отмена</Button>
				</Group>
			</Modal>
			<EditModal
				isOpen={isEditModalOpen}
				onClose={() => {
					handleEditModal.close()
				}}
				initialValues={{
					title: grade.name ?? '',
					salary: String(grade.salary) ?? '',
					toLearn: grade.params
						.filter(i => i.type === 'to_learn')
						.map(i => {
							return {
								text: i.description,
							}
						}),
					toComplete: grade.params
						.filter(i => i.type === 'to_complete')
						.map(i => {
							return {
								text: i.description,
							}
						}),
					idsToDelete: [],
				}}
			/>
		</GradeCardBase>
	)
}

export default GradeCard
