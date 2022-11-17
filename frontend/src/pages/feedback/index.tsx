import UserList from '@components/UserList'
import { Box, SimpleGrid, Text, Title } from '@mantine/core'
import Head from 'next/head'
import { BaseLayout } from 'src/layouts'
import styles from 'src/styles/main.module.scss'
import { NextPageWithLayout } from '../_app'

const FeedbackPage: NextPageWithLayout = () => {
	return (
		<>
			<Head>
				<title>Обратная связь</title>
			</Head>

			<Title order={2}>Оценка сотрудников</Title>
			<SimpleGrid
				className={styles.card}
				cols={2}
				breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
				mt="md"
			>
				<UserList />
				<Box
					sx={theme => ({
						backgroundColor: theme.colors.brand[0],
						borderRadius: '4px',
						padding: theme.spacing.xl,
					})}
				>
					<Text className={styles.info_text} weight={600}>
						Выберите сотрудника для оценки
					</Text>
				</Box>
			</SimpleGrid>
		</>
	)
}

FeedbackPage.getLayout = function getLayout(page) {
	return <BaseLayout>{page}</BaseLayout>
}

export default FeedbackPage
