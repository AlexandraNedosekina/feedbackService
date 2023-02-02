import { AdminView } from 'app/admin-view'
import { useUser } from 'entities/user'
import Head from 'next/head'
import { CareerPage } from 'pages/career'
import { EPages, ERoles } from 'shared/types'
import { BaseWrapper, useBaseWrapperContext } from 'shared/ui'
import { AppShell } from 'widgets/app-shell'
import { NextPageWithLayout } from './_app'

const Page: NextPageWithLayout = () => {
	const { user } = useUser()
	const { isEdit } = useBaseWrapperContext()

	if (isEdit && user?.roles.includes(ERoles.admin)) {
		return (
			<>
				<Head>
					<title>Карьерный рост</title>
				</Head>
				<AdminView page={EPages.Career} />
			</>
		)
	}

	return (
		<>
			<Head>
				<title>Карьерный рост</title>
			</Head>
			<CareerPage />
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
