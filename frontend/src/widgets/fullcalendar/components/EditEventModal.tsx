import 'dayjs/locale/ru'
import { Button, Flex, Modal, Title } from '@mantine/core'
import { DatePicker, TimeRangeInput } from '@mantine/dates'
import { useQuery } from '@tanstack/react-query'
import { getCalendarById, QueryKeys } from 'shared/api'
import { useState } from 'react'

interface IProps {
	isOpen: boolean
	onClose: () => void
	event: Record<any, any> | undefined
}

const EditEventModal = ({ isOpen, onClose, event }: IProps) => {
	console.log(event)
	//const [dateValue, setDateValue] = useState(new Date(event?.start))
	//const { data } = useQuery({
	//queryKey: [QueryKeys.CALENDAR_BY_ID],
	//queryFn: () => getCalendarById(event!.id),
	//enabled: !!event?.id,
	//})
	//console.log(data)

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
				value={new Date(event?.start)}
				//onChange={setDateValue}
			/>
			<TimeRangeInput
				value={[new Date(event?.start), new Date(event?.end)]}
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
