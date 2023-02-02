import { Button, Stack } from '@mantine/core'
import { DatePicker, TimeRangeInput } from '@mantine/dates'
import 'dayjs/locale/ru'
import { FC, useState } from 'react'

const DateInput: FC = () => {
	const [value, setValue] = useState<[Date, Date] | null>(null)

	function onChange(value: [Date, Date]) {
		setValue(value)
	}

	return (
		<>
			<Stack spacing="md">
				{/* <DatePicker
          placeholder="Дата"
          label="Выберете дату"
          value={value}
          onChange={setValue}
          locale="ru"

        />
        <TimeRangeInput
          clearable
          label="Выберете время"
          sx={() => ({
            alignSelf: 'flex-start',
          })}
          value={value}
          onChange={onChange}
          styles={{
            input: {
              ['.mantine-Input-input']: {
                border: 'none',
              },
            },
          }}
        /> */}
				<Button>Записаться</Button>
			</Stack>
		</>
	)
}

export default DateInput
