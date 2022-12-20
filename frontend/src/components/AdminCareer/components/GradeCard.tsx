import {
	Badge,
	Box,
	Button,
	Checkbox,
	Flex,
	Group,
	Text,
	Title,
} from '@mantine/core'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { QueryKeys, TCareerAdapter } from 'src/api'
import { useEditCareerStore } from 'src/stores'
import GradeCardMenu from './GradeCardMenu'

const GradeCard = () => {
	const {
		query: { id },
	} = useRouter()
	const selectedGradeId = useEditCareerStore(state => state.selectedGradeId)
	const queryClient = useQueryClient()
	const data = queryClient.getQueryData<TCareerAdapter[]>([
		QueryKeys.CAREER_BY_USER_ID,
		id as string,
	])

	const grade = data?.find(i => i.id === +selectedGradeId)

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
				<Checkbox
					key={item.id}
					label={item.description}
					defaultChecked={item.is_completed}
					mt="xs"
					ml="sm"
				/>
			))}
			<Text mt="sm">Что нужно сделать:</Text>
			{grade.toComplete.map(item => (
				<Checkbox
					key={item.id}
					label={item.description}
					defaultChecked={item.is_completed}
					mt="xs"
					ml="sm"
				/>
			))}

			<Flex justify={'flex-end'}>
				<Button variant="outline" bg={'white'}>
					{!grade.is_current
						? 'Сделать текущим'
						: !grade.is_completed
						? 'Завершить'
						: 'Завершить'}
				</Button>
			</Flex>
		</Box>
	)
}

export default GradeCard
