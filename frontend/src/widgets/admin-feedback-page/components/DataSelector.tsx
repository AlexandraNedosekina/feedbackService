import { Select, Text } from '@mantine/core'
import { UserSearchSelect } from 'features/user-search-select'
import { eventSelectMapper, useAdminFeedbackStore } from '../lib'
import shallow from 'zustand/shallow'
import { useQuery } from '@tanstack/react-query'
import { getAllEvents, QueryKeys } from 'shared/api'

export const DataSelector = () => {
	const { update, userId, eventId } = useAdminFeedbackStore(
		state => ({
			userId: state.userId,
			eventId: state.eventId,
			update: state.update,
		}),
		shallow
	)

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
