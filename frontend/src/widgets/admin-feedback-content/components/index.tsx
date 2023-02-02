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
import { feedbackModel } from 'entities/feedback'
import { UserCard, UserRating } from 'entities/user'
import { UserRatingsByCategory } from 'features/user-ratings-by-category'
import { useEffect } from 'react'
import { getFeedbackStats, QueryKeys } from 'shared/api'
import shallow from 'zustand/shallow'
import ColleaguesTable from './ColleaguesTable'
import ColleaguesTitle from './ColleaguesTitle'
import styles from './styles.module.sass'

export const AdminFeedbackContent = () => {
	const { eventId, userId } = feedbackModel.useAdminFeedbackStore(
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
							<UserCard
								name={data?.user.full_name || ''}
								avatar={data?.user.avatar?.thumbnail_url || ''}
								jobTitle={data?.user.job_title || undefined}
							/>
							{data?.avg_rating ? (
								<UserRating rating={data?.avg_rating} />
							) : null}
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
						<UserRatingsByCategory
							values={{
								'Выполнение задач': data?.task_completion_avg || 0,
								Вовлеченность: data?.involvement_avg || 0,
								Мотивация: data?.motivation_avg || 0,
								'Взаимодействие с командой': data?.interaction_avg || 0,
							}}
							readOnly
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
