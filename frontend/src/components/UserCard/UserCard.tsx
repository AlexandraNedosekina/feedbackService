import {
	Avatar,
	Flex,
	Group,
	ScrollArea,
	Stack,
	Text,
	Title,
} from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { getFeedback, QueryKeys } from 'src/api'
import { useFeedbackStore } from 'src/stores'
import { Buttons } from './Buttons'
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
		onError() {
			router.push('/feedback')
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
				<Group>
					<Avatar
						src={data.receiver.avatar?.thumbnail_url || null}
						size={64}
						radius={100}
					/>
					<Stack spacing={5}>
						<Title order={2} color="brand.5">
							{data.receiver.full_name}
						</Title>
						<Text color="brand.5">{data.receiver.job_title}</Text>
					</Stack>
				</Group>

				<Stack
					sx={() => ({
						maxWidth: 'max-content',
					})}
					my={40}
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
