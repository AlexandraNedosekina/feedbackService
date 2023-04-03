import { Button, Flex, Modal, Title } from '@mantine/core'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QueryKeys, updateEvent } from 'shared/api'
import { EventUpdate } from 'shared/api/generatedTypes'
import { EventCreateTimePicker as TimePicker } from 'features/event-create'
import { Form } from 'react-final-form'
import { Event } from 'shared/api/generatedTypes'
import dayjs from 'dayjs'

interface IFormValues {
	startTime: string
	startDate: string
	endTime: string
	endDate: string
}

interface IProps {
	isOpen: boolean
	onClose: () => void
	eventId: string
	event: Event
}

export default ({ isOpen, onClose, eventId, event }: IProps) => {
	const queryClient = useQueryClient()

	const { mutate, isLoading } = useMutation({
		mutationFn: (data: EventUpdate) => updateEvent(eventId, data),
		onSuccess: () => {
			queryClient.invalidateQueries([QueryKeys.EVENTS])
			onClose()
		},
	})

	function handleSubmit(values: IFormValues) {
		const [startHours, startMinutes] = values.startTime.split(':')
		const [endHours, endMinutes] = values.endTime.split(':')
		const start = dayjs(values.startDate)
			.set('hours', +startHours)
			.set('minutes', +startMinutes)
			.toISOString()
		const end = dayjs(values.endDate)
			.set('hours', +endHours)
			.set('minutes', +endMinutes)
			.toISOString()

		mutate({
			date_stop: end,
			date_start: start,
		})
	}

	return (
		<Modal
			title={<Title order={4}>Редактирование сбора обратной связи</Title>}
			opened={isOpen}
			onClose={onClose}
		>
			<Form<IFormValues>
				onSubmit={handleSubmit}
				initialValues={{
					startTime: dayjs(event.date_start + '.000Z').format('HH:mm'),
					//@ts-expect-error initial value must be type of Date
					startDate: dayjs(event.date_start).toDate(),
					endTime: dayjs(event.date_stop + '.000Z').format('HH:mm'),
					//@ts-expect-error initial value must be type of Date
					endDate: dayjs(event.date_stop).toDate(),
				}}
				validate={values => {
					const errors: Partial<Record<keyof IFormValues, string>> = {}

					if (
						dayjs(values.endDate).isBefore(values.startDate) ||
						(dayjs(values.endDate).isSame(values.startDate) &&
							+values.startTime.replace(':', '') >
							+values.endTime.replace(':', ''))
					) {
						errors.endDate = 'Окончание не может быть раньше начала'
					}

					return errors
				}}
				keepDirtyOnReinitialize
			>
				{({ handleSubmit, invalid, dirty }) => (
					<>
						<TimePicker />

						<Flex justify={'flex-end'} gap="md" mt="xl">
							<Button
								onClick={handleSubmit}
								loading={isLoading}
								disabled={invalid || !dirty}
							>
								Сохранить
							</Button>
							<Button variant={'outline'} onClick={onClose}>
								Отмена
							</Button>
						</Flex>
					</>
				)}
			</Form>
		</Modal>
	)
}
