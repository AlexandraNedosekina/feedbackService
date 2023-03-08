import { CalendarEvent } from "../generatedTypes";

export default function(events: CalendarEvent[]) {
	return events.map(event => ({
		...event,
		date_start: event.date_start + '+0000',
		date_end: event.date_end + '+0000',
	}))
}
