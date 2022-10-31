import { Container, Title } from '@mantine/core'
import Head from 'next/head'
import { BaseLayout } from 'src/layouts'
import { NextPageWithLayout } from './_app'

const FeedbackPage: NextPageWithLayout = () => {
	return (
		<Container>
			<Head>
				<title>Обратная связь</title>
			</Head>

			<Title>Обратная связь</Title>
		</Container>
	)
}

FeedbackPage.getLayout = function getLayout(page) {
	return <BaseLayout>{page}</BaseLayout>
}

export default FeedbackPage
