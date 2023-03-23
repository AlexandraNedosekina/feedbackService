import { Button, Grid, Group, Modal, Text, Title } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { showNotification } from '@mantine/notifications'
import { useMutation } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { UserSearchSelect } from 'features/user-search-select'
import { SubmissionErrors } from 'final-form'
import { useState } from 'react'
import { Field, Form, FormSpy } from 'react-final-form'
import { createCalendarEvent, QueryKeys } from 'shared/api'
import { CalendarEventCreate } from 'shared/api/generatedTypes'
import { FormInput, FormTextarea, Icon, required } from 'shared/ui'
import { ICreateEventForm } from '../types'

interface IProps {
	opened: boolean
	onClose: () => void
	selectedDate?: Date
}

export default function ({ opened, onClose, selectedDate }: IProps) {
	const [isDesc, setIsDesc] = useState<boolean>(false)
	const queryClient = useQueryClient()

	const { mutate, isLoading } = useMutation({
		mutationFn: (data: CalendarEventCreate) => createCalendarEvent(data),
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
		setIsDesc(false)
	}

	function submitHandler(
		values: ICreateEventForm
	): void | SubmissionErrors | Promise<SubmissionErrors> {
		mutate({
			title: values.title,
			description: values.desc,
			user_id: +values.userId,
			date_end: values.endTime,
			date_start: values.startTime,
		})
	}

	return (
		<>
			<Modal
				title={<Title order={4}>Создание встречи</Title>}
				opened={opened}
				onClose={onCloseHandler}
				size="lg"
				closeOnEscape={false}
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
													value={props.input.value || selectedDate}
													onChange={props.input.onChange}
													valueFormat="hh:mm, D MMMM"
													popoverProps={{ withinPortal: true }}
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
													value={props.input.value || selectedDate}
													onChange={props.input.onChange}
													valueFormat="hh:mm, D MMMM"
													popoverProps={{ withinPortal: true }}
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
											/>
										)}
									</Field>
								</Grid.Col>
							</Grid>

							<FormSpy>
								{({ valid }) => (
									<>
										<Group position="right" mt="xl">
											<Button
												disabled={!valid}
												onClick={handleSubmit}
												loading={isLoading}
											>
												Создать
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
