import { ActionIcon, Box, Group, Title } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { careerModel } from 'entities/career'
import { UserCard } from 'entities/user'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getCareerByUserId, getUserById, QueryKeys } from 'shared/api'
import { Icon } from 'shared/ui'
import shallow from 'zustand/shallow'
import CareerChips from './CareerChips'
import GradeCard from './GradeCard'

export default () => {
	const { selectedGradeId, update } = careerModel.useEdit(
		state => ({
			selectedGradeId: state.selectedGradeId,
			update: state.update,
		}),
		shallow
	)
	const {
		query: { id },
	} = useRouter()
	const { data: user, isLoading: isUserLoading } = useQuery({
		queryKey: [QueryKeys.USER, id],
		queryFn: () => getUserById(id as string),
		enabled: !!id,
	})
	const { data, isLoading } = useQuery({
		queryKey: [QueryKeys.CAREER_BY_USER_ID, id],
		queryFn: () => getCareerByUserId(id as string),
		enabled: !!id,
		onSuccess: data => {
			const defaultGradeId = data.find(i => i.is_current)?.id

			const grades = data.map(item => ({
				label: item.name || '',
				value: item.id,
				isCompleted: item.is_completed,
				isCurrent: item.is_current,
				isDefault: item.id === defaultGradeId,
			}))

			update({ grades })
			if (!selectedGradeId) {
				update({ selectedGradeId: String(defaultGradeId) })
			}
		},
	})

	return (
		<>
			<Group spacing="xs">
				<Link href="/career">
					<ActionIcon>
						<Icon icon="arrow_back_ios_new" />
					</ActionIcon>
				</Link>
				<Title order={2}>Редактирование карьерного роста</Title>
			</Group>

			{isUserLoading ? (
				<div>Загрузка...</div>
			) : (
				<Box mt="xl">
					<UserCard
						name={user?.full_name || ''}
						jobTitle={user?.job_title}
						avatar={user?.avatar?.thumbnail_url || ''}
					/>
				</Box>
			)}

			{isLoading ? (
				// TODO: add skeleton
				<div>Загрузка...</div>
			) : (
				<>
					<CareerChips />
					{data && data.length > 0 ? (
						<GradeCard />
					) : (
						<Title order={4} mt="sm">
							Создайте первый карьерный план
						</Title>
					)}
				</>
			)}
		</>
	)
}
