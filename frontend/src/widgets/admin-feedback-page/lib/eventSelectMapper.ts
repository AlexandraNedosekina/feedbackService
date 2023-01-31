import { TEventAdapter } from 'shared/api'

export const eventSelectMapper = (
	events: TEventAdapter[]
): { value: string; label: string }[] => {
	return events.map(event => ({
		value: String(event.id),
		label: `${event.parsedStartDate} - ${event.parsedEndDate}`,
	}))
}
