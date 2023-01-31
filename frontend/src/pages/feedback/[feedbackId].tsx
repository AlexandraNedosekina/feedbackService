import AdminView from '@components/AdminView'
import Head from 'next/head'
import { BaseWrapper, useBaseWrapperContext } from 'shared/ui'
import { EPages } from 'types/pages'
import { ERoles } from 'types/roles'
import { useUser } from 'utils/useUser'
import { NextPageWithLayout } from '../_app'
import { FeedbackPage } from 'widgets/feedback-page'
import { AppShell } from 'widgets/app-shell'

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
