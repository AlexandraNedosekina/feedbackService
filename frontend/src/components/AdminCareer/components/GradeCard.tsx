import { Badge, Box, Button, Flex, Group, Text, Title } from '@mantine/core'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { QueryKeys, TCareerAdapter, updateCareerTrack } from 'src/api'
import { CareerTrackUpdate } from 'src/api/generatedTypes'
import { useEditCareerStore } from 'src/stores'
import GradeCardMenu from './GradeCardMenu'
import ParamCheckbox from './ParamCheckbox'

const GradeCard = () => {
	const {
		query: { id },
	} = useRouter()
	const queryClient = useQueryClient()
	const selectedGradeId = useEditCareerStore(state => state.selectedGradeId)
	const { mutate, isLoading } = useMutation({
		mutationFn: (data: CareerTrackUpdate) =>
			updateCareerTrack(selectedGradeId, data),
		onSuccess: () => {
			queryClient.invalidateQueries([QueryKeys.CAREER_BY_USER_ID, id])
		},
	})
	const data = queryClient.getQueryData<TCareerAdapter[]>([
		QueryKeys.CAREER_BY_USER_ID,
		id,
	])

	const grade = data?.find(i => i.id === +selectedGradeId)

	function handleSubmit() {
		if (!grade) return
		const data: { is_completed?: boolean; is_current?: boolean } = {}

		if (!grade.is_completed) {
			if (grade.is_current) {
				data.is_completed = true
				data.is_current = false
			} else {
				data.is_current = true
			}
		} else {
			data.is_completed = false
		}

		mutate(data)
	}

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

			<Flex justify={'flex-end'}>
				<Button
					onClick={handleSubmit}
					variant="outline"
					bg={'white'}
					loading={isLoading}
				>
					{!grade.is_completed
						? grade.is_current
							? 'Сделать завершенным'
							: 'Сделать текущим'
						: 'Сделать незавершенным'}
				</Button>
			</Flex>
		</Box>
	)
}

export default GradeCard
