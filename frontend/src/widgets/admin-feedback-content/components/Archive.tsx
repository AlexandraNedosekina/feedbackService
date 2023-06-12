import { ActionIcon, Group, ScrollArea, Text } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { feedbackModel } from 'entities/feedback'
import { getFeedbackArchive, QueryKeys } from 'shared/api'
import { Icon } from 'shared/ui'
import shallow from 'zustand/shallow'

interface IProps {
	close: () => void
}

export function Archive({ close }: IProps) {
	const { userId } = feedbackModel.useAdminFeedbackStore(
		state => ({
			userId: state.userId,
		}),
		shallow
	)
	const { data, isLoading } = useQuery({
		queryKey: [QueryKeys.FEEDBACK_ARCHIVE, userId],
		queryFn: () => {
			if (!userId) throw new Error('no user id')
			return getFeedbackArchive(userId)
		},
		enabled: !!userId,
	})

	return (
		<div style={{ height: '100%' }}>
			<Group spacing={3}>
				<ActionIcon size="sm" onClick={close}>
					<Icon icon="arrow_back_ios_new" size={14} />
				</ActionIcon>
				<Text>Архив</Text>
			</Group>

			{isLoading ? (
				<Text>Загрузка...</Text>
			) : (
				<ScrollArea h={'100%'}>
					<pre>{JSON.stringify(data, null, 2)}</pre>
				</ScrollArea>
			)}
		</div>
	)
}
