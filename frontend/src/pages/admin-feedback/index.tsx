import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { FeedbackLayout } from 'shared/ui'
import { AdminFeedbackContent } from 'widgets/admin-feedback-content'
import { AdminFeedbackDataSelector } from 'widgets/admin-feedback-data-selector'

export const AdminFeedbackPage = () => {
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
			left={<AdminFeedbackDataSelector />}
			right={<AdminFeedbackContent />}
		/>
	)
}
