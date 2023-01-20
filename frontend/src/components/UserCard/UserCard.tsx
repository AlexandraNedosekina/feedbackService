import Username from '@components/Username'
import { Flex, ScrollArea, Stack } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { getFeedback, QueryKeys } from 'src/api'
import { useFeedbackStore } from 'src/stores'
import { Buttons } from './Buttons'
import { CompletedBadge } from './CompletedBadge'
import { Rating } from './Rating'
import { Textarea } from './Textarea'
import { useStyles } from './useStyles'

interface Props {}

const UserCard: FC<Props> = () => {
	const { classes } = useStyles()
	const update = useFeedbackStore(state => state.update)

	const {
		query: { feedbackId },
	} = useRouter()
	const router = useRouter()

	const { data, isLoading, isError } = useQuery({
		queryKey: [QueryKeys.FEEDBACK, +(feedbackId as string)],
		queryFn: () => getFeedback(+(feedbackId as string)),
		enabled: !!feedbackId,
		keepPreviousData: true,
		onSuccess: data => {
			update({
				task_completion: data.task_completion,
				involvement: data.involvement,
				motivation: data.motivation,
				interaction: data.interaction,
				achievements: data.achievements,
				wishes: data.wishes,
				remarks: data.remarks,
				comment: data.comment,
			})
		},
		retry(failureCount, error: any) {
			if (error.cause?.code === 404) return false

			return failureCount < 3
		},
		onError(error: Error) {
			router.push('/feedback')
			showNotification({
				title: 'Ошибка',
				message: error.message,
				color: 'red',
			})
		},
	})

	if (isLoading || isError)
		return (
			<div className={classes.root}>
				<p>Загрузка...</p>
			</div>
		)

	return (
		<Flex direction={'column'} className={classes.root} gap="md">
			<ScrollArea>
				<Username
					name={data?.receiver.full_name}
					jobTitle={data?.receiver.job_title}
					avatar={data?.receiver.avatar?.thumbnail_url}
				/>

				{data.completed ? <CompletedBadge /> : null}

				<Stack
					sx={() => ({
						maxWidth: 'max-content',
					})}
					mt={20}
					mb={40}
				>
					<Rating title="Выполнение задач" name="task_completion" />
					<Rating title="Вовлеченность" name="involvement" />
					<Rating title="Мотивация" name="motivation" />
					<Rating title="Взаимодействие с командой" name="interaction" />
				</Stack>

				<Stack maw={'400px'} pb={1}>
					<Textarea
						placeholder="Опишите, какие успехи достигнуты"
						label="Достижения"
						name="achievements"
					/>
					<Textarea
						placeholder="Что можно сделать лучше"
						label="Пожелания"
						name="wishes"
					/>
					<Textarea
						placeholder="Что получилось не очень"
						label="Замечания"
						name="remarks"
					/>
					<Textarea
						placeholder="Любые комментарии"
						label="Комментарии"
						name="comment"
					/>
				</Stack>
			</ScrollArea>
			<Buttons />
		</Flex>
	)
}

export default UserCard
