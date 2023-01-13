import UserRating from '@components/UserRating'
import {
	Avatar,
	Button,
	Flex,
	Group,
	LoadingOverlay,
	ScrollArea,
	Stack,
	Text,
	Title,
} from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { getFeedbackStats, QueryKeys } from 'src/api'
import { useAdminFeedbackStore } from 'src/stores'
import shallow from 'zustand/shallow'
import styles from './AdminUserCard.module.sass'
import { CategoryRating, ColleaguesTable, ColleaguesTitle } from './components'

const AdminUserCard = () => {
	const { eventId, userId } = useAdminFeedbackStore(
		state => ({
			eventId: state.eventId,
			userId: state.userId,
		}),
		shallow
	)

	const { data, isFetching, refetch } = useQuery({
		queryKey: [QueryKeys.FEEDBACK_STATS, userId, eventId],
		queryFn: () =>
			getFeedbackStats(userId, eventId === 'all' ? undefined : eventId),
		enabled: !!userId,
		keepPreviousData: true,
	})

	useEffect(() => {
		if (userId) refetch()
	}, [userId, eventId, refetch])

	return (
		<div className={styles.root}>
			<LoadingOverlay visible={isFetching} />
			{!userId && !data && (
				<Flex align="center" justify="center" h="100%">
					<Text color="brand" weight={600} size={19}>
						Выберите сотрудника для просмотра его оценок
					</Text>
				</Flex>
			)}

			{(userId || data) && (
				<ScrollArea h={'100%'}>
					<Group position="apart" align="flex-start">
						<Group>
							<Avatar
								src={data?.user.avatar?.thumbnail_url}
								size={64}
								radius={100}
							/>
							<Stack spacing={5}>
								<Group spacing={'sm'}>
									<Title order={2} color="brand.5">
										{data?.user.full_name}
									</Title>
									{data?.avg_rating && (
										<UserRating rating={data.avg_rating} />
									)}
								</Group>
								{data?.user.job_title && (
									<Text color="brand.5">{data.user.job_title}</Text>
								)}
							</Stack>
						</Group>
						<Button variant="outline">Архив</Button>
					</Group>

					<Stack
						sx={() => ({
							maxWidth: 'max-content',
						})}
						my={40}
					>
						<Text size={14}>Средние значения</Text>
						<CategoryRating
							category="Выполнение задач"
							rating={data?.task_completion_avg || 0}
						/>
						<CategoryRating
							category="Вовлеченность"
							rating={data?.involvement_avg || 0}
						/>
						<CategoryRating
							category="Мотивация"
							rating={data?.motivation_avg || 0}
						/>
						<CategoryRating
							category="Взаимодействие с командой"
							rating={data?.interaction_avg || 0}
						/>
					</Stack>

					<ColleaguesTitle />
					<ColleaguesTable />
				</ScrollArea>
			)}
		</div>
	)
}

export default AdminUserCard
