import { Button, Flex, Modal, Title } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { useDisclosure } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Field, Form, FormSpy } from 'react-final-form'
import { QueryKeys, rescheduleCalendarEvent } from 'shared/api'
import { CalendarEventReshedule } from 'shared/api/generatedTypes'
import { required } from 'shared/ui'
import ActionTemplate from './ActionTemplate'

interface IProps {
	eventId: number
	start: string
	end: string
}

interface IFormData {
	start: Date
	end: Date
}

export default function ({ eventId, end, start }: IProps) {
	const [isOpen, modalHandlers] = useDisclosure(false)

	const queryClient = useQueryClient()
	const { mutate, isLoading } = useMutation({
		mutationFn: (data: CalendarEventReshedule) =>
			rescheduleCalendarEvent(eventId, data),
		onSuccess: () => {
			modalHandlers.close()
			showNotification({
				title: 'Успешно',
				message: 'Время изменено',
				color: 'green',
			})
			queryClient.invalidateQueries([QueryKeys.CALENDAR])
		},
	})

	function handleSubmit(values: IFormData) {
		mutate({
			date_start: values.start.toISOString(),
			date_end: values.end.toISOString(),
		})
	}

	return (
		<>
			<ActionTemplate
				onClick={modalHandlers.open}
				icon="schedule"
				color="brand"
				loading={isLoading}
				tooltipText="Изменить время"
			/>
			<Modal
				opened={isOpen}
				onClose={modalHandlers.close}
				title={<Title order={4}>Редактирование времени</Title>}
				zIndex={500}
			>
				<Form<IFormData>
					onSubmit={handleSubmit}
					initialValues={{
						start: new Date(start),
						end: new Date(end),
					}}
					validate={values => {
						if (dayjs(values.end).isBefore(values.start)) {
							return {
								end: 'Окончание не может быть раньше начала',
							}
						}

						return undefined
					}}
				>
					{({ handleSubmit }) => (
						<>
							<Field name="start" validate={required}>
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
										label="Начало"
									/>
								)}
							</Field>
							<Field name="end" validate={required}>
								{props => (
									<DateTimePicker
										placeholder="Выберите окончание"
										name={props.input.name}
										value={props.input.value}
										onChange={props.input.onChange}
										valueFormat="hh:mm, D MMMM"
										popoverProps={{
											withinPortal: true,
											zIndex: 501,
										}}
										error={
											props.meta.error && props.meta.dirty
												? props.meta.error
												: null
										}
										mt="sm"
										mb="lg"
										label="Окончание"
									/>
								)}
							</Field>
							<FormSpy>
								{({ valid, dirty }) => (
									<Flex justify={'end'}>
										<Button
											disabled={!valid || !dirty}
											loading={isLoading}
											onClick={handleSubmit}
										>
											Изменить время
										</Button>
									</Flex>
								)}
							</FormSpy>
						</>
					)}
				</Form>
			</Modal>
		</>
	)
}
