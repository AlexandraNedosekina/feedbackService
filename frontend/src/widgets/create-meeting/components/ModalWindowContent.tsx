import { Flex, Select, Text } from '@mantine/core'
//import { TimeRangeInput } from '@mantine/dates'
import dayjs from 'dayjs'
import { useState } from 'react'

interface IProps {
	onClose: () => void
}

const ModalWindowContent = ({ onClose }: IProps) => {
	const now = new Date()
	const then = dayjs(now).add(30, 'minutes').toDate()
	const [value, setValue] = useState<[Date, Date]>([now, then])
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
				<Text fz="md">Время</Text>
				{/*
				<TimeRangeInput
					label="Время"
					value={value}
					onChange={setValue}
					clearable
				/>
	*/}
			</Flex>
		</>
	)
}

export default ModalWindowContent
