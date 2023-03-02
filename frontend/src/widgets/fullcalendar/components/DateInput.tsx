import { Button, Stack } from '@mantine/core'
import { DatePicker, TimeRangeInput } from '@mantine/dates'
import 'dayjs/locale/ru'
import { FC, useState } from 'react'

const DateInput: FC = () => {
	const [value, setValue] = useState<[Date, Date] | null>(null)

	function onChange(value: [Date, Date]) {
		setValue(value)
	}

	function dateSelect() {}

	return (
		<>
			<Stack spacing="md">
				<Button onClick={dateSelect}>Записаться</Button>
			</Stack>
		</>
	)
}

export default DateInput
