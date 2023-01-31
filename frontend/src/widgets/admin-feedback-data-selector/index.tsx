import { Select, Text } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { UserSearchSelect } from 'features/user-search-select'
import { getAllEvents, QueryKeys } from 'shared/api'
import { eventSelectMapper } from './lib'

interface IProps {
	userId: string
	eventId: string
	update: (...args: any) => void
}

export const AdminFeedbackDataSelector = ({
	userId,
	eventId,
	update,
}: IProps) => {
	const { data, isLoading } = useQuery({
		queryKey: [QueryKeys.EVENTS],
		queryFn: getAllEvents,
	})
	const parsedEvents = (data && eventSelectMapper(data)) || []

	return (
		<>
			<Text>Сотрудник</Text>
			<UserSearchSelect
				value={userId}
				onChange={userId => update({ userId })}
				placeholder={'Введите имя сотрудника'}
			/>

			<Text mt="md">Период сбора обратной связи</Text>
			<Select
				value={eventId}
				onChange={value => update({ eventId: value || 'all' })}
				placeholder="Выберите период"
				data={[{ label: 'За все время', value: 'all' }, ...parsedEvents]}
				disabled={isLoading}
				clearable
				rightSection={null}
				rightSectionProps={{ style: { pointerEvents: 'all' } }}
			/>
		</>
	)
}
