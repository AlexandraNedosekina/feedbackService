import UserCard from '@components/UserCard/UserCard'
import Head from 'next/head'
import { BaseLayout, FeedbackLayout } from 'src/layouts'
import { NextPageWithLayout } from '../_app'

const FeedbackUserPage: NextPageWithLayout = () => {
	return (
		<>
			<Head>
				<title>Обратная связь</title>
			</Head>

			<FeedbackLayout>
				<UserCard
					image="https://avatars.githubusercontent.com/u/25126241?v=4"
					name="Александр"
					post="Руководитель отдела"
				/>
			</FeedbackLayout>
		</>
	)
}

FeedbackUserPage.getLayout = function getLayout(page) {
	return <BaseLayout>{page}</BaseLayout>
}

export default FeedbackUserPage
