import AdminView from '@components/AdminView'
import UserCard from '@components/UserCard/UserCard'
import Head from 'next/head'
import { BaseLayout, FeedbackLayout } from 'layouts'
import { EPages } from 'types/pages'
import { ERoles } from 'types/roles'
import { useBaseLayoutContext } from 'utils/useBaseLayoutContext'
import { useUser } from 'utils/useUser'
import { NextPageWithLayout } from '../_app'

const FeedbackUserPage: NextPageWithLayout = () => {
	const { user } = useUser()
	const { isEdit } = useBaseLayoutContext()

	if (isEdit && user?.roles.includes(ERoles.admin)) {
		return (
			<>
				<Head>
					<title>Обратная связь</title>
				</Head>
				<AdminView page={EPages.Feedback} />
			</>
		)
	}

	return (
		<>
			<Head>
				<title>Обратная связь</title>
			</Head>

			<FeedbackLayout>
				<UserCard />
			</FeedbackLayout>
		</>
	)
}

FeedbackUserPage.getLayout = function getLayout(page) {
	return <BaseLayout>{page}</BaseLayout>
}

export default FeedbackUserPage
