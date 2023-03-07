import { createStyles, Flex } from '@mantine/core'
import { UserCard } from 'entities/user'
import { CalendarEvent } from 'shared/api/generatedTypes'
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
		<Flex justify={'space-between'} className={classes.item}>
			<UserCard
				name={event.owner.full_name}
				jobTitle={event.owner.job_title}
				avatar={event.owner.avatar?.thumbnail_url}
				variant="sm"
			/>
			<Flex direction={'column'} justify="space-between">
				<Time start={event.date_start} end={event.date_end} />
			</Flex>
		</Flex>
	)
}
