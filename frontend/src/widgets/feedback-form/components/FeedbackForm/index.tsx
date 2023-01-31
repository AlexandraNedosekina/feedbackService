import { Form } from 'react-final-form'
import { IFormValues } from '../../types'
import { Flex, LoadingOverlay, ScrollArea, Stack, Text } from '@mantine/core'
import { CompletedBadge } from '../CompletedBadge'
import { UserRatingsByCategory } from 'features/user-ratings-by-category'
import { Textarea } from '../Textarea'
import { Buttons } from '../Buttons'
import { useStyles } from './lib/useStyles'
import { useRouter } from 'next/router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFeedback, getFeedback, QueryKeys } from 'shared/api'
import { showNotification } from '@mantine/notifications'
import { UserCard } from 'entities/user'

const FeedbackForm = () => {
	const { classes } = useStyles()

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

	if (!feedbackId) {
		return (
			<div className={classes.root}>
				<Text color="brand" weight={600} size={19}>
					Выберите сотрудника для оценки
				</Text>
			</div>
		)
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
							<UserCard
								name={data?.receiver?.full_name}
								jobTitle={data?.receiver.job_title}
								avatar={data?.receiver.avatar?.thumbnail_url || ''}
							/>

							{data.completed ? <CompletedBadge /> : null}

							<UserRatingsByCategory
								formNames={{
									'Выполнение задач': 'taskCompletion',
									Вовлеченность: 'involvement',
									Мотивация: 'motivation',
									'Взаимодействие с командой': 'interaction',
								}}
							/>

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

export default FeedbackForm
