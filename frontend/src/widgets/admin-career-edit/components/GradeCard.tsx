import { Badge, Box, Flex, Group, Select, Text, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { careerModel, careerTypes } from 'entities/career'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { QueryKeys, TCareerAdapter, updateCareerTrack } from 'shared/api'
import { CareerTrackUpdate } from 'shared/api/generatedTypes'
import { setInitialStatus } from '../lib'
import GradeCardMenu from './GradeCardMenu'
import ParamCheckbox from './ParamCheckbox'

const GradeCard = () => {
	const {
		query: { id },
	} = useRouter()
	const queryClient = useQueryClient()
	const selectedGradeId = careerModel.useEdit(state => state.selectedGradeId)

	const data = queryClient.getQueryData<TCareerAdapter[]>([
		QueryKeys.CAREER_BY_USER_ID,
		id,
	])
	const grade = data?.find(i => i.id === +selectedGradeId)

	const statusData = useMemo<{ value: careerTypes.EStatus; label: string }[]>(
		() => [
			{ value: careerTypes.EStatus.notCompleted, label: 'Незавершенный' },
			{ value: careerTypes.EStatus.current, label: 'Текущий' },
			{ value: careerTypes.EStatus.completed, label: 'Завершенный' },
		],
		[]
	)
	const [status, setStatus] = useState<careerTypes.EStatus>(() =>
		setInitialStatus(grade)
	)

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

	function handleStatusChange(value: careerTypes.EStatus) {
		if (value === status) return

		setStatus(value)
		switch (value) {
			case careerTypes.EStatus.notCompleted:
				updateStatus({ is_completed: false, is_current: false })
				break
			case careerTypes.EStatus.current:
				updateStatus({ is_completed: false, is_current: true })
				break
			case careerTypes.EStatus.completed:
				updateStatus({ is_completed: true, is_current: false })
				break
		}
	}

	useEffect(() => {
		setStatus(() => setInitialStatus(grade))

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [grade?.is_completed, grade?.is_current, selectedGradeId])

	if (!grade) return null

	return (
		<Box
			sx={theme => ({
				backgroundColor: theme.colors.brand[0],
				padding: theme.spacing.lg,
				marginTop: theme.spacing.lg,
				borderRadius: '4px',
				maxWidth: '600px',
			})}
		>
			<Group position="apart">
				<Title order={3}>{grade.name}</Title>
				<GradeCardMenu grade={grade} />
			</Group>

			{grade.salary ? (
				<Text>
					Зарпалата:{' '}
					<Badge variant="outline" ml="md">
						{grade.salary}
					</Badge>
				</Text>
			) : null}

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
		</Box>
	)
}

export default GradeCard
