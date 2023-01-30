import Icon from '@components/Icon'
import Username from '@components/Username'
import { ActionIcon, Box, Container, Group, Title } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getUserById, QueryKeys } from 'shared/api'
import getCareerByUserId from 'shared/api/career/getCareerByUserId'
import { useEditCareerStore } from 'stores'
import CareerChips from './CareerChips'
import GradeCard from './GradeCard'

const EditCareer = () => {
	const update = useEditCareerStore(state => state.update)
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
			if (!useEditCareerStore.getState().selectedGradeId) {
				update({ selectedGradeId: String(defaultGradeId) })
			}
		},
	})

	return (
		<Container pt="lg">
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
					<Username
						name={user?.full_name || ''}
						jobTitle={user?.job_title}
						avatar={user?.avatar?.thumbnail_url}
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
		</Container>
	)
}

export default EditCareer
