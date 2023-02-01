import AdminCareer from '@components/AdminCareer'
import { AdminFeedbackPage } from 'pages/admin-feedback'
import { FC } from 'react'
import { EPages } from 'shared/types'

const Components: { [key in EPages]: FC } = {
	[EPages.Feedback]: AdminFeedbackPage,
	[EPages.Career]: AdminCareer,
}

interface IProps {
	page: EPages
}

export const AdminView = ({ page }: IProps) => {
	const Component = Components[page]

	return <Component />
}
