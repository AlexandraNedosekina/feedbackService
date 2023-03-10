import { EventContentArg } from '@fullcalendar/react'
import { Badge, Box, Text } from '@mantine/core'
import { CalendarEventStatus } from 'shared/api/generatedTypes'

const colors: Record<
	CalendarEventStatus,
	'red' | 'brand' | 'green' | 'orange'
> = {
	pending: 'brand',
	accepted: 'green',
	rejected: 'red',
	resheduled: 'orange',
}

interface IProps extends EventContentArg {}

export default function ({
	timeText,
	event: { title, extendedProps },
}: IProps) {
	const color = colors[extendedProps.status as CalendarEventStatus]

	return (
		<Badge
			variant="dot"
			size="lg"
			color={color}
			w={'100%'}
			h={'100%'}
			sx={() => ({
				border: 'none',
				justifyContent: 'start',
				paddingInline: '0',
				paddingLeft: '2px',
			})}
			title={timeText}
		>
			{title}
		</Badge>
	)
}
