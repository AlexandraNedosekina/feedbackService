import { Container, Title } from '@mantine/core'
import Head from 'next/head'
import { BaseLayout } from 'src/layouts'
import { NextPageWithLayout } from './_app'
import dynamic from 'next/dynamic'

const FullCalendar = dynamic(() => import('../components/FullCalendar'), {
	ssr: false,
})

const CommunicationPage: NextPageWithLayout = () => {
	return (
		<Container>
			<Head>
				<title>Календарь</title>
			</Head>

			<Title>Календарь</Title>
			<FullCalendar />
		</Container>
	)
}

CommunicationPage.getLayout = function getLayout(page) {
	return <BaseLayout>{page}</BaseLayout>
}

export default CommunicationPage
