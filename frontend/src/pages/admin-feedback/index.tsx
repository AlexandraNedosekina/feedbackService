import { FeedbackLayout } from 'shared/ui'
import { AdminFeedbackContent } from 'widgets/admin-feedback-content'
import { AdminFeedbackDataSelector } from 'widgets/admin-feedback-data-selector'
import { useAdminFeedbackStore } from './lib'

export const FeedbackPage = () => {
	const { eventId, update, userId } = useAdminFeedbackStore()

	return (
		<FeedbackLayout
			left={
				<AdminFeedbackDataSelector
					eventId={eventId}
					userId={userId}
					update={update}
				/>
			}
			right={<AdminFeedbackContent eventId={eventId} userId={userId} />}
		/>
	)
}
