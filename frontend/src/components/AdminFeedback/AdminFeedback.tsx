import AdminUserCard from '@components/AdminUserCard'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { AdminFeedbackLayout } from 'src/layouts'

const AdminFeedback: FC = () => {
	const {
		query: { feedbackId },
	} = useRouter()

	return (
		<AdminFeedbackLayout>
			{feedbackId ? <AdminUserCard /> : <div>Feedback</div>}
		</AdminFeedbackLayout>
	)
}

export default AdminFeedback
