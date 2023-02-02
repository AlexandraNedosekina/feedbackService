import { FeedbackLayout } from 'shared/ui'
import { FeedbackForm } from 'widgets/feedback-form'
import { FeedbackUserList } from 'widgets/feedback-user-list'

export const FeedbackPage = () => {
	return (
		<FeedbackLayout left={<FeedbackUserList />} right={<FeedbackForm />} />
	)
}
