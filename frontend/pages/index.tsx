import { GetServerSideProps } from 'next'
import { MainPage } from 'pages/main'
import { NextPageWithLayout } from './_app'

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const { cookies } = req

	if (cookies['refresh-token']) {
		return {
			redirect: {
				destination: '/profile',
				permanent: false,
			},
		}
	}

	return {
		props: {},
	}
}

const Home: NextPageWithLayout = () => {
	return <MainPage />
}

export default Home
