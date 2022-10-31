import { Button, Container, SimpleGrid, Title } from '@mantine/core'
import Head from 'next/head'
import { ReactElement } from 'react'
import { BaseLayout } from 'src/layouts'
import { NextPageWithLayout } from './_app'

const Home: NextPageWithLayout = () => {
	return (
		<Container>
			<Head>
				<title>Главная</title>
			</Head>
			<Title>Главная</Title>

			<SimpleGrid cols={3}>
				<Button>default button</Button>
				<Button variant="filled">filled button</Button>
				<Button variant="light">light button</Button>
				<Button variant="outline">outline button</Button>
				<Button variant="subtle">subtle button</Button>
				<Button variant="white">white button</Button>
				<Button disabled>disabled button</Button>
				<Button loading>loading button</Button>
			</SimpleGrid>
		</Container>
	)
}

Home.getLayout = function getLayout(page: ReactElement) {
	return <BaseLayout>{page}</BaseLayout>
}

export default Home
