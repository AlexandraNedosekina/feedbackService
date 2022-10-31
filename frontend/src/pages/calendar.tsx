import { Container, Title } from '@mantine/core'
import Head from 'next/head'
import { BaseLayout } from 'src/layouts'
import { NextPageWithLayout } from './_app'

const CommunicationPage: NextPageWithLayout = () => {
	return (
		<Container>
			<Head>
				<title>Календарь</title>
			</Head>

			<Title>Календарь</Title>
		</Container>
	)
}

CommunicationPage.getLayout = function getLayout(page) {
	return <BaseLayout>{page}</BaseLayout>
}

export default CommunicationPage
