import {
	ActionIcon,
	Button,
	Flex,
	Group,
	Menu,
	Modal,
	Text,
} from '@mantine/core'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { careerModel } from 'entities/career'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { deleteCareerTrack, QueryKeys, TCareerAdapter } from 'shared/api'
import { Icon } from 'shared/ui'
import { EditModal } from './EditModal'

interface IProps {
	grade: TCareerAdapter
}

const GradeCardMenu = ({ grade }: IProps) => {
	const {
		query: { id },
	} = useRouter()
	const queryClient = useQueryClient()
	const { mutate: deleteGrade, isLoading: isDeleteGradeLoading } = useMutation(
		{
			mutationFn: () => deleteCareerTrack(String(grade.id)),
			onSuccess: () => {
				queryClient.invalidateQueries([QueryKeys.CAREER_BY_USER_ID, id])
			},
		}
	)
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
	const [isEditModalOpen, setIsEditModalOpen] = useState(false)
	const update = careerModel.useEditGrade(state => state.update)
	const restore = careerModel.useEditGrade(state => state.restore)

	function handleEdit() {
		update({
			careerId: String(grade.id),
			isEdit: true,
		})
		setIsEditModalOpen(true)
	}

	function handleDelete() {
		deleteGrade()
	}

	return (
		<>
			<Menu position="bottom-end">
				<Menu.Target>
					<Flex justify={'flex-end'}>
						<ActionIcon>
							<Image src={'/menu.svg'} width={24} height={24} alt="" />
						</ActionIcon>
					</Flex>
				</Menu.Target>
				<Menu.Dropdown>
					<Menu.Item
						onClick={handleEdit}
						icon={<Icon icon="edit" />}
						color="brand"
					>
						Редактировать
					</Menu.Item>
					<Menu.Item
						onClick={() => setIsDeleteModalOpen(true)}
						icon={<Icon icon="delete" />}
						color="red"
					>
						Удалить
					</Menu.Item>
				</Menu.Dropdown>
			</Menu>
			<Modal
				title="Удалить трек?"
				opened={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
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
					<Button onClick={() => setIsDeleteModalOpen(false)}>
						Отмена
					</Button>
				</Group>
			</Modal>
			<EditModal
				isOpen={isEditModalOpen}
				onClose={() => {
					setIsEditModalOpen(false)
					restore()
				}}
				initialValues={{
					title: grade.name ?? '',
					salary: String(grade.salary) ?? '',
					toLearn: grade.toLearn.map(i => ({
						text: i.description,
						apiId: String(i.id),
					})),
					toComplete: grade.toComplete.map(i => ({
						text: i.description,
						apiId: String(i.id),
					})),
					idsToDelete: [],
				}}
			/>
		</>
	)
}

export default GradeCardMenu
