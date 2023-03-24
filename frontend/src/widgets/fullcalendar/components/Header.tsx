import FullCalendar from '@fullcalendar/react'
import { ActionIcon, Button, Flex, Group, Title } from '@mantine/core'
import { CalendarAcceptEvents } from 'features/calendar-accept-events'
import { useState } from 'react'
import { Icon } from 'shared/ui'

enum EView {
	dayGridMonth = 'dayGridMonth',
	timeGridWeek = 'timeGridWeek',
	timeGridDay = 'timeGridDay',
}

interface IProps {
	calendar: FullCalendar | null
	openCreateModal: () => void
}

export default ({ calendar, openCreateModal }: IProps) => {
	if (calendar === null) return null
	const calendarApi = calendar.getApi()

	const [title, setTitle] = useState(calendarApi.view.title)
	const [viewType, setViewType] = useState(calendarApi.view.type)

	const prev = () => {
		calendarApi.prev()
		setTitle(calendarApi.view.title)
		console.log(calendarApi.getCurrentData().currentDate)
	}
	const next = () => {
		calendarApi.next()
		setTitle(calendarApi.view.title)
	}
	const today = () => {
		calendarApi.today()
		setTitle(calendarApi.view.title)
	}
	const setDayGridMonth = () => {
		calendarApi.changeView(EView.dayGridMonth)
		setTitle(calendarApi.view.title)
		setViewType(calendarApi.view.type)
	}
	const setTimeGridWeek = () => {
		calendarApi.changeView(EView.timeGridWeek)
		setTitle(calendarApi.view.title)
		setViewType(calendarApi.view.type)
	}
	const setTimeGridDay = () => {
		calendarApi.changeView(EView.timeGridDay)
		setTitle(calendarApi.view.title)
		setViewType(calendarApi.view.type)
	}

	return (
		<Group mb="md">
			<Button.Group>
				<ActionIcon
					onClick={prev}
					variant="filled"
					color="brand"
					size="lg"
					sx={() => ({
						borderTopRightRadius: 0,
						borderBottomRightRadius: 0,
					})}
				>
					<Icon icon="arrow_back_ios_new" />
				</ActionIcon>
				<ActionIcon
					onClick={next}
					variant="filled"
					color="brand"
					size="lg"
					sx={() => ({
						borderTopLeftRadius: 0,
						borderBottomLeftRadius: 0,
					})}
				>
					<Flex
						sx={() => ({
							transform: 'rotate(180deg)',
							marginBottom: '2px',
						})}
					>
						<Icon icon="arrow_back_ios_new" />
					</Flex>
				</ActionIcon>
			</Button.Group>

			<Button onClick={today}>Сегодня</Button>

			<ActionIcon
				size="lg"
				variant="filled"
				color="brand"
				onClick={openCreateModal}
				title="Создать встречу"
			>
				<Icon icon="add" size={20} />
			</ActionIcon>

			<CalendarAcceptEvents />

			<Title
				order={2}
				sx={() => ({
					flexGrow: 1,
					textAlign: 'center',
				})}
			>
				{title}
			</Title>

			<Button.Group>
				<Button
					onClick={setDayGridMonth}
					sx={theme => ({
						backgroundColor:
							viewType === EView.dayGridMonth
								? theme.colors.brand[7]
								: theme.colors.brand[5],
					})}
				>
					Месяц
				</Button>
				<Button
					onClick={setTimeGridWeek}
					sx={theme => ({
						backgroundColor:
							viewType === EView.timeGridWeek
								? theme.colors.brand[7]
								: theme.colors.brand[5],
					})}
				>
					Неделя
				</Button>
				<Button
					onClick={setTimeGridDay}
					sx={theme => ({
						backgroundColor:
							viewType === EView.timeGridDay
								? theme.colors.brand[7]
								: theme.colors.brand[5],
					})}
				>
					День
				</Button>
			</Button.Group>
		</Group>
	)
}
