import Icon from '@components/Icon'
import {
	ActionIcon,
	Avatar,
	Container,
	Group,
	Stack,
	Text,
	Title,
} from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getUserById, QueryKeys } from 'src/api'
import getCareerByUserId from 'src/api/career/getCareerByUserId'
import { useEditCareerStore } from 'src/stores'
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
	const { data, isLoading, isFetching } = useQuery({
		queryKey: [QueryKeys.CAREER_BY_USER_ID, id],
		queryFn: () => getCareerByUserId(id as string),
		enabled: !!id,
		onSuccess: data => {
			const defaultGradeId = data.find(i => i.is_current)?.id

			const grades = data.map(item => ({
				label: item.name,
				value: item.id,
				isCompleted: item.is_completed,
				isCurrent: item.is_current,
				isDefault: item.id === defaultGradeId,
			}))

			update({ grades })
			update({ selectedGradeId: String(defaultGradeId) })
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
				<Group mt="xl">
					<Avatar
						src={
							null
							// data
							// 	? `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${data.receiver.id}/avatar`
							// 	: null
						}
						size={64}
						radius={100}
					/>
					<Stack spacing={5}>
						<Title order={2} color="brand.5">
							{user?.full_name}
						</Title>
						{user?.job_title && <Text color="brand.5">Fullstack</Text>}
					</Stack>
				</Group>
			)}

			{isLoading || isFetching ? (
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
