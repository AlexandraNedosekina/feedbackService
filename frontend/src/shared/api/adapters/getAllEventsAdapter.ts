import dayjs from 'dayjs'
import { Event } from '../generatedTypes'

export type TEventAdapter = Event & {
	parsedStartDate: string
	parsedEndDate: string
}

export default function getAllEventsAdapter(events: Event[]): TEventAdapter[] {
	return events.map(event => ({
		...event,
		parsedStartDate: dayjs(`${event.date_start}.000Z`).format(
			'DD.MM.YYYY (HH:mm)'
		),
		parsedEndDate: dayjs(`${event.date_stop}.000Z`).format(
			'DD.MM.YYYY (HH:mm)'
		),
	}))
}
