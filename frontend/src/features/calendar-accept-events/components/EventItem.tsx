import { createStyles, Flex, Spoiler, Text, Title } from '@mantine/core'
import { UserCard } from 'entities/user'
import { CalendarEvent } from 'shared/api/generatedTypes'
import Actions from './Actions'
import Time from './Time'

const useStyles = createStyles(theme => ({
	item: {
		border: `1px solid ${theme.colors.brand[5]}`,
		borderRadius: '4px',
		padding: theme.spacing.xs,
		marginBottom: theme.spacing.md,
	},
}))

interface IProps {
	event: CalendarEvent
}

export default function EventItem({ event }: IProps) {
	const { classes } = useStyles()
	return (
		<Flex justify={'space-between'} className={classes.item} gap="lg">
			<div>
				<UserCard
					name={event.owner.full_name}
					jobTitle={event.owner.job_title}
					avatar={event.owner.avatar?.thumbnail_url}
					variant="sm"
				/>
				<Title order={3} pt="lg">
					<Text span color="gray.6" size="sm" weight={'normal'}>
						Тема:{' '}
					</Text>
					{event.title}
				</Title>
				<Spoiler
					maxHeight={140}
					showLabel="Показать полностью"
					hideLabel="Скрыть"
					sx={theme => ({
						backgroundColor: theme.colors.gray[1],
						padding: '7px',
						borderRadius: '4px',
						marginTop: theme.spacing.xs,
					})}
				>
					<Text>
						<Text color="gray.6" size="sm" span>
							Описание:
						</Text>{' '}
						{event.description ? (
							event.description
						) : (
							<Text color="gray.6" size="sm" span>
								Пусто
							</Text>
						)}
					</Text>
				</Spoiler>
			</div>
			<Flex direction={'column'} justify="space-between" gap="md">
				<Time start={event.date_start} end={event.date_end} />
				<Flex gap="sm" justify={'end'}>
					<Actions
						eventId={event.id}
						start={event.date_start}
						end={event.date_end}
					/>
				</Flex>
			</Flex>
		</Flex>
	)
}
