import { Box, Group, Text } from '@mantine/core'
import { FormDatePickerInput, FormTimeInput, required } from 'shared/ui'

const TimePicker = () => {
	return (
		<>
			<Box mt="md">
				<Text>Начало</Text>
				<Group align="start">
					<FormTimeInput name="startTime" validate={required} />
					<FormDatePickerInput name="startDate" validate={required} />
				</Group>
			</Box>
			<Box mt="md">
				<Text>Окончание</Text>
				<Group align="start">
					<FormTimeInput name="endTime" validate={required} />
					<FormDatePickerInput name="endDate" validate={required} />
				</Group>
			</Box>
		</>
	)
}

export default TimePicker
