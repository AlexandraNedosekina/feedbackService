import { Box, Group, Text } from '@mantine/core'
import { DatePicker, TimeInput } from '@mantine/dates'
import { FC } from 'react'
import { useCreateEventStore } from 'src/stores'
import shallow from 'zustand/shallow'

interface Props {
	title: string
	value: 'start' | 'end'
}

const TimePicker: FC<Props> = ({ title, value }) => {
	const timeAccessor = `${value}Time` as const
	const dateAccessor = `${value}Date` as const

	const [time, date] = useCreateEventStore(
		state => [state[timeAccessor], state[dateAccessor]],
		shallow
	)
	const update = useCreateEventStore(state => state.update)

	return (
		<Box mt="md">
			<Text>{title}</Text>
			<Group>
				<TimeInput
					defaultValue={time}
					onChange={time => update({ [timeAccessor]: time })}
				/>
				<DatePicker
					locale="ru"
					placeholder="Выберите дату"
					defaultValue={date}
					onChange={date => update({ [dateAccessor]: date })}
				/>
			</Group>
		</Box>
	)
}

export default TimePicker
