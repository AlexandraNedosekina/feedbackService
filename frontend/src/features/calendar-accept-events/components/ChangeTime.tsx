import { Button, Flex, Modal, Title } from '@mantine/core'
import { DatePickerInput, TimeInput } from '@mantine/dates'
import { useDisclosure } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Reducer, useReducer } from 'react'
import { QueryKeys, rescheduleCalendarEvent } from 'shared/api'
import { CalendarEventReshedule } from 'shared/api/generatedTypes'
import { modalResetOverflow } from 'shared/lib'
import ActionTemplate from './ActionTemplate'

interface IProps {
	eventId: number
	start: string
	end: string
}

interface IReducerData {
	date: Date
	startTime: string
	endTime: string
}

function setInitialReducerState(start: string, end: string): IReducerData {
	return {
		date: new Date(start),
		startTime: dayjs(start).format('hh:mm'),
		endTime: dayjs(end).format('hh:mm'),
	}
}

export default function ({ eventId, end, start }: IProps) {
	const [dates, updateDates] = useReducer<
		Reducer<IReducerData, Partial<IReducerData>>
	>((prev, next) => {
		return { ...prev, ...next }
	}, setInitialReducerState(start, end))
	const [isOpen, modalHandlers] = useDisclosure(false, {
		onClose() {
			updateDates(setInitialReducerState(start, end))
		},
	})

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

	function handleSubmit() {
		const [startHours, startMinutes] = dates.startTime.split(':')
		const [endHours, endMinutes] = dates.endTime.split(':')
		const dateStart = dayjs(dates.date)
			.set('hour', +startHours)
			.set('minute', +startMinutes)
			.toISOString()
		const dateEnd = dayjs(dates.date)
			.set('hour', +endHours)
			.set('minute', +endMinutes)
			.toISOString()
		mutate({
			date_start: dateStart,
			date_end: dateEnd,
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
				styles={theme => ({
					...modalResetOverflow(theme),
				})}
			>
				<DatePickerInput
					label="Дата"
					defaultValue={dates.date}
					onChange={value => {
						if (!value) return
						updateDates({ date: new Date(value.toISOString()) })
					}}
					sx={() => ({ width: 'max-content', minWidth: '120px' })}
				/>

				<Flex gap="md" align="center" my="md">
					<TimeInput
						label="Начало"
						defaultValue={dates.startTime}
						onChange={({ target: { value } }) =>
							updateDates({ startTime: value })
						}
					/>
					<TimeInput
						label="Окончание"
						defaultValue={dates.endTime}
						onChange={({ target: { value } }) =>
							updateDates({ endTime: value })
						}
					/>
				</Flex>

				<Flex justify={'end'}>
					<Button loading={isLoading} onClick={() => handleSubmit()}>
						Изменить время
					</Button>
				</Flex>
			</Modal>
		</>
	)
}
