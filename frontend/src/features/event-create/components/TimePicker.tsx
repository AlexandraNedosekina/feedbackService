import { Box, Group, Text } from '@mantine/core'
import { DatePickerInput, TimeInput } from '@mantine/dates'
import dayjs from 'dayjs'
import shallow from 'zustand/shallow'
import { useCreateEventStore } from '../model'

const TimePicker = () => {
	const {
		endTime,
		startTime,
		endDate,
		startDate,
		getIsEndDateAfter,
		getIsEndTimeAfter,
		getIsSameDates,
		getIsStartTimeAfterNow,
		getIsStartDateAfterNow,
		getIsStartDateSame,
	} = useCreateEventStore(
		state => ({
			startTime: state.startTime,
			endTime: state.endTime,
			startDate: state.startDate,
			endDate: state.endDate,
			getIsEndDateAfter: state.getIsEndDateAfter,
			getIsEndTimeAfter: state.getIsEndTimeAfter,
			getIsSameDates: state.getIsSameDates,
			getIsStartTimeAfterNow: state.getIsStartTimeAfterNow,
			getIsStartDateAfterNow: state.getIsStartDateAfterNow,
			getIsStartDateSame: state.getIsStartDateSame,
		}),
		shallow
	)
	const update = useCreateEventStore(state => state.update)

	return (
		<>
			<Box mt="md">
				<Text>Начало</Text>
				<Group align="start">
					<TimeInput
						defaultValue={dayjs(startTime).format('hh:mm')}
						onChange={({ target: { value } }) => {
							const [hours, minutes] = value.split(':')
							update({
								startTime: dayjs()
									.set('hours', +hours)
									.set('minutes', +minutes)
									.toDate(),
							})
						}}
						maw={'min-content'}
						error={
							getIsStartDateSame() && !getIsStartTimeAfterNow()
								? 'Время начала должно быть позже текущего'
								: ''
						}
					/>
					<DatePickerInput
						placeholder="Выберите дату"
						defaultValue={startDate}
						dropdownType="modal"
						modalProps={{ zIndex: 500 }}
						onChange={value => update({ startDate: value })}
						error={
							!getIsStartDateAfterNow() && !getIsStartDateSame()
								? 'Дата начала должна быть позже текущей'
								: ''
						}
					/>
				</Group>
			</Box>
			<Box mt="md">
				<Text>Окончание</Text>
				<Group align="start">
					<TimeInput
						defaultValue={dayjs(endTime).format('hh:mm')}
						onChange={({ target: { value } }) => {
							const [hours, minutes] = value.split(':')
							update({
								endTime: dayjs()
									.set('hours', +hours)
									.set('minutes', +minutes)
									.toDate(),
							})
						}}
						maw={'min-content'}
						error={
							!getIsEndTimeAfter() && getIsSameDates()
								? 'Время окончания должно быть позже времени начала'
								: ''
						}
					/>
					<DatePickerInput
						placeholder="Выберите дату"
						defaultValue={endDate}
						dropdownType="modal"
						modalProps={{ zIndex: 500 }}
						onChange={value => update({ endDate: value })}
						error={
							!getIsEndDateAfter() && !getIsSameDates()
								? 'Дата окончания должна быть позже или равна дате начала'
								: ''
						}
					/>
				</Group>
			</Box>
		</>
	)
}

export default TimePicker
