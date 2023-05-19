import { EventContentArg } from '@fullcalendar/react'
import {
	ActionIcon,
	Avatar,
	Badge,
	CloseButton,
	Flex,
	Popover,
	Spoiler,
	Stack,
	Text,
	Title,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import dayjs from 'dayjs'
import { useUser } from 'entities/user'
import { CalendarEventActions } from 'features/calendar-accept-events'
import { CalendarEventStatus, UserDetails } from 'shared/api/generatedTypes'
import { Icon } from 'shared/ui'
import DeleteEventModal from './DeleteEventModal'
import EditEventModal from './EditEventModal'

const colors: Record<
	CalendarEventStatus,
	'red.7' | 'brand' | 'green' | 'orange'
> = {
	pending: 'brand',
	accepted: 'green',
	rejected: 'red.7',
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

interface IProps extends EventContentArg {}

export default function ({
	timeText,
	event: { title, extendedProps },
	event,
	view,
}: IProps) {
	const color = colors[extendedProps.status as CalendarEventStatus]
	const status = words[extendedProps.status as CalendarEventStatus]

	const { user } = useUser()

	const isUsersEvent = extendedProps.ownerId === user.id
	const canEdit = extendedProps.status !== 'accepted' && isUsersEvent
	const canDelete = isUsersEvent
	const canAccept =
		(status === 'Ожидает подтверждения' || status === 'Время изменено') &&
		!isUsersEvent

	const participant: UserDetails = isUsersEvent
		? extendedProps.user
		: extendedProps.owner

	const [isDeleteModalOpen, deleteModalHandlers] = useDisclosure(false)
	const [isEditModalOpen, editModalHandlers] = useDisclosure(false)
	const [isOpen, { open, close }] = useDisclosure(false)

	return (
		<>
			<Popover
				opened={isOpen}
				onClose={close}
				closeOnClickOutside={canAccept ? false : true}
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
						title={`${timeText}, ${status}`}
					>
						{title}
					</Badge>
				</Popover.Target>
				<Popover.Dropdown bg="white" sx={() => ({ zIndex: 1000 })}>
					<Stack align="start" spacing={'sm'}>
						<Flex justify={'space-between'} align="center" w={'100%'}>
							<Title order={5}>{title}</Title>
							<CloseButton onClick={close} />
						</Flex>
						{extendedProps.desc ? (
							<Spoiler
								maxHeight={140}
								showLabel="Показать полностью"
								hideLabel="Скрыть"
							>
								<Text py="xs" sx={() => ({ whiteSpace: 'normal' })}>
									{extendedProps.desc}
								</Text>
							</Spoiler>
						) : null}
						<Badge
							leftSection={
								<Avatar
									src={participant.avatar?.thumbnail_url}
									mr={5}
									size={24}
									radius="xl"
								/>
							}
							pl={0}
							size="lg"
							radius={'xl'}
						>
							{participant.full_name}
						</Badge>
						<Flex gap="sm">
							<Text color="dimmed">Время и дата</Text>
							<Text>
								{dayjs(event.startStr.split('+')[0]).format(
									'HH:mm, D MMMM'
								)}{' '}
								- {dayjs(event.endStr).format('HH:mm D MMMM')}
							</Text>
						</Flex>
						<Flex align="center" gap="xs">
							<Badge variant={'dot'} color={color} size="lg">
								{status}
							</Badge>
							{canAccept ? (
								<CalendarEventActions
									eventId={extendedProps.id}
									start={event.startStr}
									end={event.endStr}
								/>
							) : null}
						</Flex>
						{status === 'Отклонено' && extendedProps.cause ? (
							<Text>
								<Text span color="dimmed">
									Причина:
								</Text>{' '}
								{extendedProps.cause}
							</Text>
						) : null}
						<Flex justify={'end'} gap="xs" w="100%">
							{canDelete ? (
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
							{canEdit ? (
								<ActionIcon
									color="brand"
									size="md"
									variant="outline"
									title="Редактировать"
									onClick={editModalHandlers.open}
								>
									<Icon icon="edit" size={18} />
								</ActionIcon>
							) : null}
						</Flex>
					</Stack>
				</Popover.Dropdown>
			</Popover>
			{canDelete ? (
				<DeleteEventModal
					isOpen={isDeleteModalOpen}
					onClose={deleteModalHandlers.close}
					id={extendedProps.id}
				/>
			) : null}
			{canEdit ? (
				<EditEventModal
					opened={isEditModalOpen}
					onClose={editModalHandlers.close}
					event={event}
				/>
			) : null}
		</>
	)
}
