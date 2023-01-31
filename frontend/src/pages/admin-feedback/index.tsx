import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { FeedbackLayout } from 'shared/ui'
import { AdminFeedbackContent } from 'widgets/admin-feedback-content'
import { AdminFeedbackDataSelector } from 'widgets/admin-feedback-data-selector'
import { useAdminFeedbackStore } from './lib'

export const AdminFeedbackPage = () => {
	const { eventId, update, userId } = useAdminFeedbackStore()
	const {
		query: { feedbackId },
	} = useRouter()
	const router = useRouter()

	useEffect(() => {
		if (feedbackId) {
			router.push('/feedback')
		}
	}, [feedbackId, router])

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
