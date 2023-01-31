import AdminView from '@components/AdminView'
import Head from 'next/head'
import { BaseLayout, useBaseLayoutContext } from 'shared/ui'
import { EPages } from 'types/pages'
import { ERoles } from 'types/roles'
import { useUser } from 'utils/useUser'
import { NextPageWithLayout } from '../_app'
import { FeedbackPage } from 'widgets/feedback-page'

const Page: NextPageWithLayout = () => {
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

			<FeedbackPage />
		</>
	)
}

Page.getLayout = function getLayout(page) {
	return <BaseLayout>{page}</BaseLayout>
}

export default Page
