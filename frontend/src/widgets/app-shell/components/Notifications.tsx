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
import dayjs from 'dayjs'
import Link from 'next/link'
import { useCallback, useMemo } from 'react'
import { InView } from 'react-intersection-observer'
import { QueryKeys } from 'shared/api'
import {
	deleteNotification,
	getMyNotifactions,
	seeNotification,
} from 'shared/api/notifications'
import { Icon } from 'shared/ui'

const useStyles = createStyles(theme => ({
	notification: {
		border: `1px solid ${theme.colors.gray[4]}`,
		borderRadius: '4px',
		paddingInline: '1rem',
		paddingBlock: '0.5rem',
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
	const { mutate: seeNotificationMutate } = useMutation({
		mutationFn: (id: string) => seeNotification(id),
		onSuccess: () => {
			queryClient.invalidateQueries([QueryKeys.NOTIFICATIONS])
		},
	})

	const isUnseenNotifications: boolean = useMemo(() => {
		if (!data) return false

		return Boolean(data.records.filter(item => !item.has_seen).length)
	}, [data])

	const seeNotificationHandle = useCallback(
		(inView: boolean, notificationId: string) => {
			if (inView) {
				seeNotificationMutate(notificationId)
			}
		},
		[seeNotificationMutate]
	)

	return (
		<Popover position="bottom-end" width={240}>
			<Popover.Target>
				<Indicator color="red" offset={2} disabled={!isUnseenNotifications}>
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
						<Text color="dimmed" align="center">
							Уведомлений нет
						</Text>
					) : (
						<Stack spacing="sm">
							{data?.records
								.sort((a, b) => {
									return (
										new Date(b.created_at).getTime() -
										new Date(a.created_at).getTime()
									)
								})
								.map(i => (
									<InView
										key={i.id}
										as="div"
										onChange={inView => {
											if (i.has_seen) return
											seeNotificationHandle(inView, String(i.id))
										}}
									>
										<Box className={classes.notification}>
											{i.message}

											<Divider my={5} />

											{i.subject.includes('calendar') ? (
												<Link href="/calendar">
													<Text size="sm" color="blue">
														Перейти в календарь
													</Text>
												</Link>
											) : null}

											<Text color="dimmed" size="xs" align="right">
												{dayjs(i.created_at + '+0000').format(
													'D MMMM, HH:mm'
												)}
											</Text>

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
									</InView>
								))}
						</Stack>
					)}
				</ScrollArea>
			</Popover.Dropdown>
		</Popover>
	)
}
