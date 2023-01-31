import { FeedbackLayout } from 'shared/ui'
import { Content } from './Content'
import { DataSelector } from './DataSelector'

export default () => {
	return <FeedbackLayout left={<DataSelector />} right={<Content />} />
}
