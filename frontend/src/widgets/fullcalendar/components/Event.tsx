import { EventContentArg } from '@fullcalendar/react'
import {
	ActionIcon,
	Badge,
	Box,
	Flex,
	Popover,
	Text,
	Title,
} from '@mantine/core'
import dayjs from 'dayjs'
import { CalendarEventStatus } from 'shared/api/generatedTypes'
import { Icon } from 'shared/ui'

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
	event,
}: IProps) {
	const color = colors[extendedProps.status as CalendarEventStatus]

	console.log(event.startStr)
	return (
		<Popover withArrow position="right" shadow="md" width={400}>
			<Popover.Target>
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
			</Popover.Target>
			<Popover.Dropdown bg="white">
				<Title order={5}>{title}</Title>

				{extendedProps.desc ? (
					<Text py="md" sx={() => ({ whiteSpace: 'normal' })}>
						{extendedProps.desc}
					</Text>
				) : null}

				<Flex gap="md">
					<Text color="dimmed">Время и дата</Text>
					<Text>
						{dayjs(event.startStr).format('D MMMM, hh:mm')} -{' '}
						{dayjs(event.endStr).format('D MMMM, hh:mm')}
					</Text>
				</Flex>

				<Flex justify={'end'} mt="sm">
					<ActionIcon color={'brand'}>
						<Icon icon="delete" />
					</ActionIcon>
					<ActionIcon color="brand">
						<Icon icon="edit" />
					</ActionIcon>
				</Flex>
			</Popover.Dropdown>
		</Popover>
	)
}
