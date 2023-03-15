import { EventContentArg } from '@fullcalendar/react'
import {
	ActionIcon,
	Badge,
	CloseButton,
	Flex,
	Popover,
	Spoiler,
	Text,
	Title,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import dayjs from 'dayjs'
import { useUser } from 'entities/user'
import { CalendarEventActions } from 'features/calendar-accept-events'
import { CalendarEventStatus } from 'shared/api/generatedTypes'
import { Icon } from 'shared/ui'
import DeleteEventModal from './DeleteEventModal'

const colors: Record<
	CalendarEventStatus,
	'red' | 'brand' | 'green' | 'orange'
> = {
	pending: 'brand',
	accepted: 'green',
	rejected: 'red',
	resheduled: 'orange',
}

const words: Record<
	CalendarEventStatus,
	'Подтверждено' | 'Отклонено' | 'Ожидает подтверждения' | 'Время изменено'
> = {
	pending: 'Ожидает подтверждения',
	accepted: 'Подтверждено',
	rejected: 'Отклонено',
	resheduled: 'Время изменено',
}

interface IProps extends EventContentArg { }

export default function({
	timeText,
	event: { title, extendedProps },
	event,
	view,
}: IProps) {
	const { user } = useUser()
	const isUsersEvent = extendedProps.ownerId === user.id
	const [isDeleteModalOpen, deleteModalHandlers] = useDisclosure(false)
	const [isOpen, { open, close }] = useDisclosure(false)

	const color = colors[extendedProps.status as CalendarEventStatus]
	const status = words[extendedProps.status as CalendarEventStatus]

	return (
		<>
			<Popover
				opened={isOpen}
				onClose={close}
				closeOnClickOutside={
					status === 'Ожидает подтверждения' && !isUsersEvent ? false : true
				}
				withArrow
				position={view.type === 'timeGridDay' ? 'bottom' : 'right'}
				shadow="md"
				width={400}
				withinPortal
			>
				<Popover.Target>
					<Badge
						onClick={open}
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
				<Popover.Dropdown bg="white" sx={() => ({ zIndex: 1000 })}>
					<Flex justify={'space-between'} align="center">
						<Title order={5}>{title}</Title>
						<CloseButton onClick={close} />
					</Flex>

					{extendedProps.desc ? (
						<Spoiler
							maxHeight={140}
							showLabel="Показать полностью"
							hideLabel="Скрыть"
						>
							<Text pt="md" sx={() => ({ whiteSpace: 'normal' })}>
								{extendedProps.desc}
							</Text>
						</Spoiler>
					) : null}

					<Flex gap="md" pt="md">
						<Text color="dimmed">Время и дата</Text>
						<Text>
							{dayjs(event.startStr).format('D MMMM, hh:mm')} -{' '}
							{dayjs(event.endStr).format('D MMMM, hh:mm')}
						</Text>
					</Flex>

					<Flex align="center" gap="xs" pt="xs">
						<Badge variant={'dot'} color={color} size="lg">
							{status}
						</Badge>
						{status === 'Ожидает подтверждения' &&
							!isUsersEvent ? (
							<CalendarEventActions
								eventId={extendedProps.id}
								start={event.startStr}
								end={event.endStr}
							/>
						) : null}
					</Flex>

					<Flex justify={'end'} mt="sm" gap="xs">
						{isUsersEvent ? (
							<ActionIcon
								onClick={deleteModalHandlers.open}
								color={'brand'}
								size="md"
								variant={'outline'}
								title="Удалить"
							>
								<Icon icon="delete" size={18} />
							</ActionIcon>
						) : null}
						{extendedProps.status !== 'accepted' &&
							isUsersEvent ? (
							<ActionIcon
								color="brand"
								size="md"
								variant="outline"
								title="Редактировать"
							>
								<Icon icon="edit" size={18} />
							</ActionIcon>
						) : null}
					</Flex>
				</Popover.Dropdown>
			</Popover>
			<DeleteEventModal
				isOpen={isDeleteModalOpen}
				onClose={deleteModalHandlers.close}
				id={extendedProps.id}
			/>
		</>
	)
}
