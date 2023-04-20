import { ActionIcon, Box, Popover, Text } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { QueryKeys } from 'shared/api'
import { getMyNotifactions } from 'shared/api/notifications'
import { Icon } from 'shared/ui'

export default function Notifications() {
	const { data, isLoading } = useQuery({
		queryFn: () => getMyNotifactions(),
		queryKey: [QueryKeys.NOTIFICATIONS],
		refetchInterval: 1000 * 60 * 2, // 2 minutes
	})

	return (
		<Popover position="bottom-end">
			<Popover.Target>
				<ActionIcon variant="filled" color="brand" size="lg">
					<Icon icon="notifications" size={28} />
				</ActionIcon>
			</Popover.Target>
			<Popover.Dropdown>
				{isLoading ? (
					<Text>Загрузка...</Text>
				) : data?.length === 0 ? (
					<Text color="dimmed">Уведомлений опыт</Text>
				) : (
					<div>
						{data?.map(i => (
							<Box key={i.id}>{i.message}</Box>
						))}
					</div>
				)}
			</Popover.Dropdown>
		</Popover>
	)
}
