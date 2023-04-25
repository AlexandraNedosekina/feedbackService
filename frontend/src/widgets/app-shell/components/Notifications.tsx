import {
	ActionIcon,
	Box,
	Divider,
	Indicator,
	Popover,
	ScrollArea,
	Stack,
	Text,
	createStyles,
} from '@mantine/core'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { QueryKeys } from 'shared/api'
import { deleteNotification, getMyNotifactions } from 'shared/api/notifications'
import { Icon } from 'shared/ui'

const useStyles = createStyles(theme => ({
	notification: {
		border: `1px solid ${theme.colors.gray[4]}`,
		borderRadius: '4px',
		padding: '1rem',
		position: 'relative',
	},
	deleteNotificationButton: {
		position: 'absolute',
		top: 0,
		right: 0,
	},
}))

export default function Notifications() {
	const { classes } = useStyles()

	const queryClient = useQueryClient()
	const { data, isLoading } = useQuery({
		queryFn: () => getMyNotifactions(),
		queryKey: [QueryKeys.NOTIFICATIONS],
		refetchInterval: 1000 * 60 * 2, // 2 minutes
	})
	const { mutate: deleteNotificationMutate } = useMutation({
		mutationFn: (id: string) => deleteNotification(id),
		onSuccess: () => {
			queryClient.invalidateQueries([QueryKeys.NOTIFICATIONS])
		},
	})

	return (
		<Popover position="bottom-end">
			<Popover.Target>
				<Indicator color="red" offset={2} disabled={!data?.total_count}>
					<ActionIcon variant="filled" color="brand" size="lg">
						<Icon icon="notifications" size={28} />
					</ActionIcon>
				</Indicator>
			</Popover.Target>
			<Popover.Dropdown>
				<ScrollArea
					h={data?.total_count ? 200 : undefined}
					type="always"
					offsetScrollbars={!!data?.total_count}
				>
					{isLoading ? (
						<Text>Загрузка...</Text>
					) : data?.total_count === 0 ? (
						<Text color="dimmed">Уведомлений нет</Text>
					) : (
						<Stack spacing="sm">
							{data?.records.map(i => (
								<Box key={i.id} className={classes.notification}>
									{i.message}

									<Divider my={5} />

									{i.subject.includes('calendar') ? (
										<Link href="/calendar">
											<Text size="sm" color="blue">
												Перейти в календарь
											</Text>
										</Link>
									) : null}

									<ActionIcon
										onClick={() =>
											deleteNotificationMutate(String(i.id))
										}
										size="xs"
										className={classes.deleteNotificationButton}
									>
										<Icon icon="close" />
									</ActionIcon>
								</Box>
							))}
						</Stack>
					)}
				</ScrollArea>
			</Popover.Dropdown>
		</Popover>
	)
}
