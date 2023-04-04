import { Button, Flex, Group, Menu, Modal, Select, Text } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { careerModel, ECareerGradeStatus } from 'entities/career'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import {
	deleteCareerTrack,
	QueryKeys,
	TCareerAdapter,
	updateCareerTrack,
} from 'shared/api'
import { CareerTrackUpdate } from 'shared/api/generatedTypes'
import { setInitialStatus } from '../lib'
import ParamCheckbox from './ParamCheckbox'
import { GradeCard as GradeCardBase } from 'entities/career'
import { Icon } from 'shared/ui'
import { useDisclosure } from '@mantine/hooks'
import { EditModal } from './EditModal'

const GradeCard = () => {
	const {
		query: { id },
	} = useRouter()
	const queryClient = useQueryClient()
	const selectedGradeId = careerModel.useEdit(state => state.selectedGradeId)
	const update = careerModel.useEditGrade(state => state.update)
	const restore = careerModel.useEditGrade(state => state.restore)

	const data = queryClient.getQueryData<TCareerAdapter[]>([
		QueryKeys.CAREER_BY_USER_ID,
		id,
	])
	const grade = data?.find(i => i.id === +selectedGradeId)

	const statusData = useMemo<{ value: ECareerGradeStatus; label: string }[]>(
		() => [
			{ value: ECareerGradeStatus.notCompleted, label: 'Незавершенный' },
			{ value: ECareerGradeStatus.current, label: 'Текущий' },
			{ value: ECareerGradeStatus.completed, label: 'Завершенный' },
		],
		[]
	)
	const [status, setStatus] = useState<ECareerGradeStatus>(() =>
		setInitialStatus(grade)
	)
	const [isDeleteModalOpen, handleDeleteModal] = useDisclosure(false)
	const [isEditModalOpen, handleEditModal] = useDisclosure(false)

	const { mutate: updateStatus } = useMutation({
		mutationFn: (data: CareerTrackUpdate) =>
			updateCareerTrack(selectedGradeId, data),
		onSuccess: () => {
			queryClient.invalidateQueries([QueryKeys.CAREER_BY_USER_ID, id])
			showNotification({
				title: 'Успешно',
				message: 'Статус успешно обновлен',
				color: 'green',
			})
		},
		onError(error: any) {
			showNotification({
				title: 'Ошибка',
				message: error,
				color: 'red',
			})
			setStatus(() => setInitialStatus(grade))
		},
	})
	const { mutate: deleteGrade, isLoading: isDeleteGradeLoading } = useMutation(
		{
			mutationFn: () => deleteCareerTrack(String(grade?.id)),
			onSuccess: () => {
				queryClient.invalidateQueries([QueryKeys.CAREER_BY_USER_ID, id])
				handleDeleteModal.close()
			},
		}
	)

	function handleStatusChange(value: ECareerGradeStatus) {
		if (value === status) return

		setStatus(value)
		switch (value) {
			case ECareerGradeStatus.notCompleted:
				updateStatus({ is_completed: false, is_current: false })
				break
			case ECareerGradeStatus.current:
				updateStatus({ is_completed: false, is_current: true })
				break
			case ECareerGradeStatus.completed:
				updateStatus({ is_completed: true, is_current: false })
				break
		}
	}
	function handleEdit() {
		update({
			careerId: String(grade?.id),
			isEdit: true,
		})
		handleEditModal.open()
	}

	function handleDelete() {
		deleteGrade()
	}

	useEffect(() => {
		setStatus(() => setInitialStatus(grade))

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [grade?.is_completed, grade?.is_current, selectedGradeId])

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
			{grade.toLearn.map(item => (
				<ParamCheckbox
					key={item.id}
					label={item.description}
					id={item.id}
					careerId={String(grade.id)}
					type="toLearn"
					isCompleted={item.is_completed}
				/>
			))}
			<Text mt="sm">Что нужно сделать:</Text>
			{grade.toComplete.map(item => (
				<ParamCheckbox
					key={item.id}
					label={item.description}
					id={item.id}
					careerId={String(grade.id)}
					type="toComplete"
					isCompleted={item.is_completed}
				/>
			))}

			<Text mt="sm">Статус:</Text>
			<Flex>
				<Select
					data={statusData}
					value={status}
					onChange={handleStatusChange}
				/>
			</Flex>

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
		</GradeCardBase>
	)
}

export default GradeCard
