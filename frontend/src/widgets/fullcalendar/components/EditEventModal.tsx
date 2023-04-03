import { Button, Grid, Group, Modal, Text, Title } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { showNotification } from '@mantine/notifications'
import { useMutation } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { UserSearchSelect } from 'features/user-search-select'
import { SubmissionErrors } from 'final-form'
import { useState } from 'react'
import { Field, Form, FormSpy } from 'react-final-form'
import { QueryKeys, updateCalendarById } from 'shared/api'
import { CalendarEventUpdate } from 'shared/api/generatedTypes'
import { FormInput, FormTextarea, Icon, required } from 'shared/ui'
import { ICreateEventForm } from '../types'
import { EventApi } from '@fullcalendar/react'
import { useQueryClient } from '@tanstack/react-query'

interface IProps {
	opened: boolean
	onClose: () => void
	event: EventApi
}

export default function ({ opened, onClose, event }: IProps) {
	const [isDesc, setIsDesc] = useState<boolean>(
		event?.extendedProps?.desc ? true : false
	)
	const queryClient = useQueryClient()

	const { mutate, isLoading } = useMutation({
		mutationFn: (data: CalendarEventUpdate) =>
			updateCalendarById(event?.extendedProps.id, data),
		onSuccess: () => {
			onCloseHandler()
			showNotification({
				message: 'Успешно',
				color: 'green',
			})
			queryClient.refetchQueries([QueryKeys.CALENDAR])
		},
	})

	function onCloseHandler() {
		onClose()
	}

	function submitHandler(
		values: ICreateEventForm
	): void | SubmissionErrors | Promise<SubmissionErrors> {
		mutate({
			title: values.title,
			description: values.desc,
			user_id: +values.userId,
			//@ts-expect-error good
			date_end: values.endTime,
			//@ts-expect-error good
			date_start: values.startTime,
		})
	}

	return (
		<>
			<Modal
				title={<Title order={4}>Редактирование встречи</Title>}
				opened={opened}
				onClose={onCloseHandler}
				size="lg"
				closeOnEscape={false}
				zIndex={500}
				withinPortal
			>
				<Form<ICreateEventForm>
					onSubmit={submitHandler}
					validate={values => {
						if (dayjs(values.endTime).isBefore(values.startTime)) {
							return {
								endTime: 'Окончание не может быть раньше начала',
							}
						}

						return undefined
					}}
					initialValues={{
						title: event?.title,
						desc: event?.extendedProps?.desc,
						//@ts-expect-error default value in Date
						endTime: event?.end,
						//@ts-expect-error default value in Date
						startTime: event?.start,
						userId: String(event?.extendedProps?.user.id),
					}}
				>
					{({ handleSubmit }) => (
						<>
							<Grid columns={4}>
								<Grid.Col span={1}>
									<Text>Название</Text>
								</Grid.Col>
								<Grid.Col span={3}>
									<FormInput name="title" validate={required} />
								</Grid.Col>
							</Grid>

							<Grid columns={4} mt="sm">
								{isDesc ? (
									<>
										<Grid.Col span={1}>
											<Text>Описание</Text>
										</Grid.Col>
										<Grid.Col span={3}>
											<FormTextarea name="desc" minRows={3} />
										</Grid.Col>
									</>
								) : (
									<Grid.Col offset={1} span={3}>
										<Button
											variant="outline"
											leftIcon={<Icon icon="add" size={18} />}
											onClick={() => setIsDesc(true)}
										>
											Описание
										</Button>
									</Grid.Col>
								)}
							</Grid>

							<Grid columns={4} mt="sm">
								<Grid.Col span={1}>
									<Text>Дата и время</Text>
								</Grid.Col>
								<Grid.Col span={3}>
									<Group align="start">
										<Field name="startTime" validate={required}>
											{props => (
												<DateTimePicker
													placeholder="Выберите начало"
													name={props.input.name}
													value={props.input.value}
													onChange={props.input.onChange}
													valueFormat="HH:mm, D MMMM"
													popoverProps={{
														withinPortal: true,
														zIndex: 501,
													}}
													error={
														props.meta.error && props.meta.dirty
															? props.meta.error
															: null
													}
												/>
											)}
										</Field>
										<Text color="brand" mt={5}>
											-
										</Text>
										<Field name="endTime" validate={required}>
											{props => (
												<DateTimePicker
													placeholder="Выберите окончание"
													name={props.input.name}
													value={props.input.value}
													onChange={props.input.onChange}
													valueFormat="HH:mm, D MMMM"
													popoverProps={{
														withinPortal: true,
														zIndex: 501,
													}}
													error={
														props.meta.error && props.meta.dirty
															? props.meta.error
															: null
													}
												/>
											)}
										</Field>
									</Group>
								</Grid.Col>
							</Grid>

							<Grid columns={4} mt="sm">
								<Grid.Col span={1}>
									<Text>Сотрудник</Text>
								</Grid.Col>
								<Grid.Col span={2}>
									<Field name="userId" validate={required}>
										{props => (
											<UserSearchSelect
												value={props.input.value}
												onChange={props.input.onChange}
												defaultValue={
													event?.extendedProps?.user.full_name
												}
												defaultData={[
													{
														value: String(
															event?.extendedProps?.user.id
														),
														full_name:
															event?.extendedProps?.user
																.full_name,
														email: event?.extendedProps?.user
															.email,
														label: event?.extendedProps?.user
															.full_name,
														original: event?.extendedProps.user,
														job_title:
															event?.extendedProps.user
																.job_title,
													},
												]}
											/>
										)}
									</Field>
								</Grid.Col>
							</Grid>

							<FormSpy>
								{({ valid, dirty }) => (
									<>
										<Group position="right" mt="xl">
											<Button
												disabled={!valid || !dirty}
												onClick={handleSubmit}
												loading={isLoading}
											>
												Сохранить
											</Button>
										</Group>
									</>
								)}
							</FormSpy>
						</>
					)}
				</Form>
			</Modal>
		</>
	)
}
