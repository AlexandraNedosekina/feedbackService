import AdminCareer from '@components/AdminCareer'
import { FC } from 'react'
import { EPages } from 'types/pages'
import { AdminFeedbackPage } from 'widgets/admin-feedback-page'

const Components: { [key in EPages]: FC } = {
	[EPages.Feedback]: AdminFeedbackPage,
	[EPages.Career]: AdminCareer,
}

interface Props {
	page: EPages
}

const AdminView: FC<Props> = ({ page }) => {
	const Component = Components[page]

	return <Component />
}

export default AdminView
