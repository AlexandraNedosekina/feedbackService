import { Container, Title } from '@mantine/core'
import Head from 'next/head'
import { BaseLayout } from 'src/layouts'
import { NextPageWithLayout } from './_app'

const EventsPage: NextPageWithLayout = () => {
	return (
		<Container>
			<Head>
				<title>Events</title>
			</Head>

			<Title>Events</Title>
		</Container>
	)
}

EventsPage.getLayout = function getLayout(page) {
	return <BaseLayout>{page}</BaseLayout>
}

export default EventsPage
