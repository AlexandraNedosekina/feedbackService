import { Select, Text } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { feedbackModel } from 'entities/feedback'
import { UserSearchSelect } from 'features/user-search-select'
import { getAllEvents, QueryKeys } from 'shared/api'
import shallow from 'zustand/shallow'
import { eventSelectMapper } from './lib'

export const AdminFeedbackDataSelector = () => {
	const { eventId, userId, update } = feedbackModel.useAdminFeedbackStore(
		state => ({
			eventId: state.eventId,
			userId: state.userId,
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
