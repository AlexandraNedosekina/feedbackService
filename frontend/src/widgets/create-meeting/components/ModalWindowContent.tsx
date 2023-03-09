import { Button, Flex, Select } from '@mantine/core'
import { TimeRangeInput, DatePickerInput } from '@mantine/dates'

import dayjs from 'dayjs'
import { useState } from 'react'

interface IProps {
	onClose: () => void
}

const ModalWindowContent = ({ onClose }: IProps) => {
	const now = new Date()
	const then = dayjs(now).add(30, 'minutes').toDate()
	const [value, setValue] = useState<[Date, Date | null]>([now, then])
	return (
		<>
			<Select
				placeholder="Выберите сотрудника"
				data={[
					{ value: 'Громова Софья', label: 'Тимлид' },
					{ value: 'Гафаров Владислав', label: 'Разработчик' },
				]}
			/>
			<Flex justify={'center'}>
				<TimeRangeInput
					label="Время"
					value={value}
					onChange={setValue}
					clearable
				/>
				<DatePickerInput
					label="Pick date"
					placeholder="Pick date"
					value={value}
					onChange={setValue}
					mx="auto"
					maw={400}
				/>
				<Button>Создать</Button>
			</Flex>
		</>
	)
}

export default ModalWindowContent
