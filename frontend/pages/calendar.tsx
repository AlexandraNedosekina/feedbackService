import Head from 'next/head'
import { CalendarPage } from 'pages/calendar'
import { BaseWrapper } from 'shared/ui'
import { AppShell } from 'widgets/app-shell'
import { NextPageWithLayout } from './_app'

const CommunicationPage: NextPageWithLayout = () => {
	return (
		<>
			<Head>
				<title>Календарь встреч</title>
			</Head>
			<CalendarPage />
		</>
	)
}

CommunicationPage.getLayout = function getLayout(page) {
	return (
		<BaseWrapper>
			<AppShell>{page}</AppShell>
		</BaseWrapper>
	)
}

export default CommunicationPage
