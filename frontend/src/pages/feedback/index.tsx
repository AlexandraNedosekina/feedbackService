import { useRouter } from 'next/router'
import { FeedbackLayout } from 'shared/ui'
import { FeedbackForm } from 'widgets/feedback-form'
import { FeedbackUserList } from 'widgets/feedback-user-list'

export const FeedbackPage = () => {
	const {
		query: { feedbackId },
	} = useRouter()

	return (
		<FeedbackLayout
			left={<FeedbackUserList />}
			right={<FeedbackForm key={feedbackId as string} />}
		/>
	)
}
