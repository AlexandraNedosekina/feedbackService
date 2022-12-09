import {
	Button,
	Checkbox,
	Flex,
	Group,
	SegmentedControl,
	Text,
} from '@mantine/core'
import { DatePicker, TimeInput } from '@mantine/dates'
import dayjs from 'dayjs'
import { FC, useState } from 'react'

interface Props {
	onClose: () => void
}

const CreateEventModal: FC<Props> = ({ onClose }) => {
	const [value, setValue] = useState('all')
	const [isTwoWay, setIsTwoWay] = useState(false)

	return (
		<>
			<SegmentedControl
				value={value}
				onChange={setValue}
				data={[
					{ label: 'Общий', value: 'all' },
					{ label: 'Для 1 сотрудника', value: 'one' },
				]}
				color="brand"
				size="md"
			/>
			{value === 'one' && (
				<>
					<Checkbox
						checked={isTwoWay}
						onChange={() => setIsTwoWay(!isTwoWay)}
						mt="md"
						label="Коллеги сотрудника смогут оценивать друг друга"
					/>
					<Text my="xl">Выбор сотрудника</Text>
				</>
			)}

			<Text mt="md">Начало</Text>
			<Group>
				<TimeInput defaultValue={dayjs().hour(0).minute(0).toDate()} />
				<DatePicker
					locale="ru"
					placeholder="Выберите дату"
					defaultValue={new Date()}
				/>
			</Group>

			<Text mt="md">Окончание</Text>
			<Group>
				<TimeInput defaultValue={dayjs().hour(0).minute(0).toDate()} />
				<DatePicker
					locale="ru"
					placeholder="Выберите дату"
					defaultValue={dayjs().add(1, 'month').toDate()}
				/>
			</Group>

			<Flex justify={'flex-end'} mt="lg">
				<Button>Создать</Button>
				<Button onClick={onClose} variant="outline" ml="md">
					Отмена
				</Button>
			</Flex>
		</>
	)
}

export default CreateEventModal
