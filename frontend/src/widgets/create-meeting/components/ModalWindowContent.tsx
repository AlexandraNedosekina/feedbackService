import {
	Button,
	Flex,
	Group,
	Select,
	Text,
	SimpleGrid,
	Stack,
	TextInput,
	Grid,
} from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'

import dayjs from 'dayjs'
import { useState } from 'react'

interface IProps {
	onClose: () => void
	left: JSX.Element
	right: JSX.Element
}

export const ModalWindowContent = ({ onClose, left, right }: IProps) => {
	const now = new Date()
	const then = dayjs(now).add(30, 'minutes').toDate()
	const [value, setValue] = useState<[Date, Date | null]>([now, then])
	return (
		<>
			<Grid columns={3} mt="md">
				<Grid.Col span={1}>
					<Text>Название</Text>
					<Text>Дата и время</Text>
				</Grid.Col>
				<Grid.Col span={2} mb="xl">
					<Stack justify="space-around">
						<TextInput
							placeholder="Введите название события"
							// label="Название"
						/>
						<TextInput placeholder="+ Описание" />
						<Flex>
							<DateTimePicker
								// label="Дата и время"
								placeholder="Дата и время"
								maw={1000}
								mx="auto"
								popoverProps={{ withinPortal: true }}
							/>
							-
							<DateTimePicker
								placeholder="Дата и время"
								maw={400}
								mx="auto"
								popoverProps={{ withinPortal: true }}
							/>
						</Flex>
						<Select
							placeholder="Выберите сотрудника"
							data={[
								{ value: 'Громова Софья', label: 'Тимлид' },
								{ value: 'Гафаров Владислав', label: 'Разработчик' },
							]}
						/>
					</Stack>
				</Grid.Col>
			</Grid>
			<Button>
				{right}
				Создать
			</Button>
		</>
	)
}
