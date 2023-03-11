import { Button, Flex, Select } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'

import dayjs from 'dayjs'
import { useState } from 'react'

interface IProps {
	onClose: () => void
}

export const ModalWindowContent = ({ onClose }: IProps) => {
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
				<DateTimePicker
					label="Pick date and time"
					placeholder="Pick date and time"
					maw={400}
					mx="auto"
					popoverProps={{ withinPortal: true }}
				/>
				<Button>Создать</Button>
			</Flex>
		</>
	)
}
