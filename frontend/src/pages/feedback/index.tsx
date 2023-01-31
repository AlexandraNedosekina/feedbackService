import AdminView from '@components/AdminView'
import { Box, Text } from '@mantine/core'
import Head from 'next/head'
import { FeedbackLayout } from 'layouts'
import { EPages } from 'types/pages'
import { ERoles } from 'types/roles'
import { useUser } from 'utils/useUser'
import { NextPageWithLayout } from '../_app'
import { BaseLayout, useBaseLayoutContext } from 'shared/ui'

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
