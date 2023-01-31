import UserList from './UserList'
import { FeedbackLayout } from 'shared/ui'
import FeedbackForm from './FeedbackForm'

export default () => {
	return <FeedbackLayout left={<UserList />} right={<FeedbackForm />} />
}
