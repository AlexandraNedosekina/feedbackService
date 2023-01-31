import AdminCareer from '@components/AdminCareer'
import AdminFeedback from '@components/AdminFeedback'
import { FC } from 'react'
import { EPages } from 'types/pages'

const Components: { [key in EPages]: FC } = {
	[EPages.Feedback]: AdminFeedback,
	[EPages.Career]: AdminCareer,
}

interface IProps {
	page: EPages
}

export const AdminView = ({ page }: IProps) => {
	const Component = Components[page]

	return <Component />
}
