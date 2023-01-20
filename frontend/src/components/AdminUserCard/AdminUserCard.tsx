import Username from '@components/Username'
import {
	Button,
	Flex,
	Group,
	LoadingOverlay,
	ScrollArea,
	Stack,
	Text,
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
						<Username
							name={data?.user.full_name || ''}
							avatar={data?.user.avatar?.thumbnail_url}
							jobTitle={data?.user.job_title || undefined}
							rating={data?.avg_rating}
						/>
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
					{data && data?.colleagues_rating.length !== 0 && (
						<ColleaguesTable colleagues={data.colleagues_rating} />
					)}
				</ScrollArea>
			)}
		</div>
	)
}

export default AdminUserCard
