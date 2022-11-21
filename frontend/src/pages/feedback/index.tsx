import { Box, Text } from '@mantine/core'
import Head from 'next/head'
import { BaseLayout, FeedbackLayout } from 'src/layouts'
import { NextPageWithLayout } from '../_app'

const FeedbackPage: NextPageWithLayout = () => {
	return (
		<>
			<Head>
				<title>Обратная связь</title>
			</Head>

			<FeedbackLayout>
				<Box
					sx={theme => ({
						backgroundColor: 'white',
						borderRadius: '4px',
						padding: theme.spacing.xl,
						height: '100%',
					})}
				>
					<Text color="brand" weight={600} size={19}>
						Выберите сотрудника для оценки
					</Text>
				</Box>
			</FeedbackLayout>
		</>
	)
}

FeedbackPage.getLayout = function getLayout(page) {
	return <BaseLayout>{page}</BaseLayout>
}

export default FeedbackPage
