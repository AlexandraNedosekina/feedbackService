import { AdminView } from 'app/admin-view'
import Head from 'next/head'
import { FeedbackPage } from 'pages/feedback'
import { BaseWrapper, useBaseWrapperContext } from 'shared/ui'
import { EPages } from 'shared/types'
import { ERoles } from 'shared/types'
import { useUser } from 'entities/user'
import { AppShell } from 'widgets/app-shell'
import { NextPageWithLayout } from '../_app'

const Page: NextPageWithLayout = () => {
	const { user } = useUser()
	const { isEdit } = useBaseWrapperContext()

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
	return (
		<BaseWrapper>
			<AppShell>{page}</AppShell>
		</BaseWrapper>
	)
}

export default Page
