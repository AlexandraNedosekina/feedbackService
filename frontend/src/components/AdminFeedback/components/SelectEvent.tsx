import { Select, Text } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { getAllEvents, QueryKeys } from 'src/api'
import { useAdminFeedbackStore } from 'src/stores'
import shallow from 'zustand/shallow'
import { eventSelectMapper } from '../utils'

const SelectEvent = () => {
	const { eventId, update } = useAdminFeedbackStore(
		state => ({
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

export default SelectEvent
