import UserRating from '@components/UserRating'
import {
	Avatar,
	Button,
	Flex,
	Group,
	LoadingOverlay,
	Rating,
	ScrollArea,
	Stack,
	Text,
	Title,
} from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useAdminFeedbackStore } from 'src/stores'
import shallow from 'zustand/shallow'
import styles from './AdminUserCard.module.sass'
import { ColleaguesTable, ColleaguesTitle } from './components'

function simulateFetch(userId: string, eventId: string): Promise<string> {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(`${userId} - ${eventId}`)
		}, 400)
	})
}

const AdminUserCard = () => {
	const { eventId, userId } = useAdminFeedbackStore(
		state => ({
			eventId: state.eventId,
			userId: state.userId,
		}),
		shallow
	)

	const { data, isFetching, refetch } = useQuery({
		queryFn: () => simulateFetch(userId, eventId),
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
				<ScrollArea>
					<Group position="apart" align="flex-start">
						<Group>
							<Avatar src={null} size={64} radius={100} />
							<Stack spacing={5}>
								<Group spacing={'sm'}>
									<Title order={2} color="brand.5">
										Имя Фамилия
									</Title>
									<UserRating rating={4.75} />
								</Group>
								<Text color="brand.5">Должность</Text>
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
						{eventId === 'all' && <Text size={14}>Средние значения</Text>}
						<Group position="apart">
							<div>Выполнение задач</div>
							<Rating size="md" value={5} readOnly />
						</Group>
						<Group position="apart">
							<div>Вовлеченность</div>
							<Rating size="md" value={4} readOnly />
						</Group>
						<Group position="apart">
							<div>Мотивация</div>
							<Rating size="md" value={5} readOnly />
						</Group>
						<Group position="apart">
							<div>Взаимодействие с командой</div>
							<Rating size="md" value={5} readOnly />
						</Group>
					</Stack>

					<ColleaguesTitle />
					<ColleaguesTable />
				</ScrollArea>
			)}
		</div>
	)
}

export default AdminUserCard
