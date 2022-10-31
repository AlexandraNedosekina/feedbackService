import { Container, Title } from '@mantine/core'
import Head from 'next/head'
import { BaseLayout } from 'src/layouts'
import { NextPageWithLayout } from './_app'

const CareerPage: NextPageWithLayout = () => {
	return (
		<Container>
			<Head>
				<title>Твой карьерный рост</title>
			</Head>

			<Title>Твой карьерный рост</Title>
		</Container>
	)
}

CareerPage.getLayout = function getLayout(page) {
	return <BaseLayout>{page}</BaseLayout>
}

export default CareerPage
