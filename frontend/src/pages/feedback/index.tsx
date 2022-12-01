import AdminView from '@components/AdminView'
import { Box, Text } from '@mantine/core'
import Head from 'next/head'
import { BaseLayout, FeedbackLayout } from 'src/layouts'
import { EPages } from 'src/types/pages'
import { ERoles } from 'src/types/roles'
import { useBaseLayoutContext } from 'src/utils/useBaseLayoutContext'
import { useUser } from 'src/utils/useUser'
import { NextPageWithLayout } from '../_app'

const FeedbackPage: NextPageWithLayout = () => {
	const { user } = useUser()
	const { isEdit } = useBaseLayoutContext()

	if (isEdit && user?.roles.includes(ERoles.admin)) {
		return (
			<>
				<Head>
					<title>Обратная связь</title>
				</Head>
				<AdminView page={EPages.Feedback} />
			</>
		)
	}

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
