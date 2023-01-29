import Username from '@components/Username'
import { Flex, LoadingOverlay, ScrollArea, Stack } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { Form } from 'react-final-form'
import { createFeedback, getFeedback, QueryKeys } from 'src/api'
import { useFeedbackStore } from 'src/stores'
import { Buttons } from './Buttons'
import { CompletedBadge } from './CompletedBadge'
import { Rating } from './Rating'
import { Textarea } from './Textarea'
import { IFormValues } from './types'
import { useStyles } from './useStyles'

interface Props {}

const UserCard: FC<Props> = () => {
	const { classes } = useStyles()
	const update = useFeedbackStore(state => state.update)

	const {
		query: { feedbackId },
	} = useRouter()
	const router = useRouter()
	const queryClient = useQueryClient()

	const { data, isLoading, isError, isFetching } = useQuery({
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
	const { mutate } = useMutation({
		mutationFn: (data: IFormValues) => {
			return createFeedback(+(feedbackId as string), {
				task_completion: data.taskCompletion,
				involvement: data.involvement,
				motivation: data.motivation,
				interaction: data.interaction,
				achievements: data.achievements,
				wishes: data.wishes,
				remarks: data.remarks,
				comment: data.comments,
			})
		},
		onSuccess: data => {
			queryClient.invalidateQueries([QueryKeys.FEEDBACK, data.id])
			queryClient.invalidateQueries([QueryKeys.FEEDBACK_LIST])

			showNotification({
				title: 'Успешно',
				message: 'Обратная связь сохранена',
				color: 'green',
			})
		},
	})

	const initialValues: IFormValues = {
		taskCompletion: data?.task_completion || 0,
		involvement: data?.involvement || 0,
		motivation: data?.motivation || 0,
		interaction: data?.interaction || 0,
		achievements: data?.achievements || '',
		wishes: data?.wishes || '',
		remarks: data?.remarks || '',
		comments: data?.comment || '',
	}

	if (isLoading || isError || isFetching)
		return (
			<div className={classes.root}>
				<LoadingOverlay visible />
			</div>
		)

	return (
		<Flex direction={'column'} className={classes.root} gap="md">
			<Form<IFormValues>
				onSubmit={values => {
					mutate(values)
				}}
				initialValues={initialValues}
				subscription={{
					submitting: true,
					pristine: true,
				}}
				validate={values => {
					const errors: Partial<Record<keyof IFormValues, string>> = {}

					if (!values.taskCompletion)
						errors.taskCompletion = 'Обязательное поле'
					if (!values.involvement) errors.involvement = 'Обязательное поле'
					if (!values.motivation) errors.motivation = 'Обязательное поле'
					if (!values.interaction) errors.interaction = 'Обязательное поле'

					return errors
				}}
				keepDirtyOnReinitialize={true}
			>
				{() => (
					<>
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
								<Rating
									title="Выполнение задач"
									name="taskCompletion"
								/>
								<Rating title="Вовлеченность" name="involvement" />
								<Rating title="Мотивация" name="motivation" />
								<Rating
									title="Взаимодействие с командой"
									name="interaction"
								/>
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
									name="comments"
								/>
							</Stack>
						</ScrollArea>
						<Buttons />
					</>
				)}
			</Form>
		</Flex>
	)
}

export default UserCard
