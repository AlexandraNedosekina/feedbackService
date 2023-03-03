import 'dayjs/locale/ru'
import { Button, Flex, Modal, Text, Title } from '@mantine/core'
import { DatePicker, TimeRangeInput } from '@mantine/dates'

interface IProps {
	isOpen: boolean
	onClose: () => void
}

const EditEventModal = ({ isOpen, onClose }: IProps) => {
	return (
		<Modal
			opened={isOpen}
			onClose={onClose}
			size="md"
			title={<Title order={4}>Редактирование встречи</Title>}
		>
			<DatePicker
				locale="ru"
				label="Дата"
				placeholder="Выберите дату встречи"
			/>
			<TimeRangeInput
				label="Время"
				my={'sm'}
				styles={{
					input: {
						['.mantine-Input-input']: {
							border: 'none',
						},
					},
				}}
			/>
			<Flex justify={'end'}>
				<Button>Сохранить</Button>
			</Flex>
		</Modal>
	)
}

export default EditEventModal
