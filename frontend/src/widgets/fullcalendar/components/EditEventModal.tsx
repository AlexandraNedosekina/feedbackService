import 'dayjs/locale/ru'
import { Button, Flex, Modal, Title } from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getCalendarById, QueryKeys, updateCalendarById } from 'shared/api'
import { useFullcalendarStore } from '../model'
import { UserCard } from 'entities/user'

interface IProps {
	isOpen: boolean
	onClose: () => void
}

const EditEventModal = ({ isOpen, onClose }: IProps) => {
	const { event, update } = useFullcalendarStore(store => ({
		update: store.update,
		event: store.eventForEdit,
	}))
	//const { data } = useQuery({
	//queryKey: [QueryKeys.CALENDAR_BY_ID],
	//queryFn: () => getCalendarById(event!.id),
	//enabled: !!event?.id,
	//})

	//console.log(data)

	//const { mutate } = useMutation({
	//mutationFn: () => updateCalendarById(event?.id, {
	//date_start: '',
	//date_end: '',
	//})
	//})
	//
	if (!event) return null

	return (
		<Modal
			opened={isOpen}
			onClose={onClose}
			size="md"
			title={<Title order={4}>Редактирование встречи</Title>}
		>
			<UserCard
				name={event.user.full_name}
				jobTitle={event.user.job_title}
				avatar={event.user.avatar?.thumbnail_url}
				variant="sm"
			/>
			{/*
			<DatePicker
				locale="ru"
				label="Дата"
				placeholder="Выберите дату встречи"
				value={event.start}
				onChange={value => {
					if (!value) return
					update({
						eventForEdit: {
							...event,
							start: value,
						},
					})
				}}
				mt='sm'
			/>
			<TimeRangeInput
				value={[event.start, event.end]}
				label="Время"
				mt={'sm'}
				styles={{
					input: {
						['.mantine-Input-input']: {
							border: 'none',
						},
					},
				}}
			/>
	*/}{' '}
			<Flex justify={'end'} gap="md" mt="xl">
				<Button color="red" variant="outline">
					Удалить
				</Button>
				<Button>Сохранить</Button>
			</Flex>
		</Modal>
	)
}

export default EditEventModal
