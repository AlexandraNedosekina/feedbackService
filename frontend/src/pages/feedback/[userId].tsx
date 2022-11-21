import UserCard from '@components/UserCard/UserCard'
import UserList from '@components/UserList'
import { Box, SimpleGrid, Title } from '@mantine/core'
import Head from 'next/head'
import { BaseLayout } from 'src/layouts'
import styles from 'src/styles/main.module.scss'
import { NextPageWithLayout } from '../_app'

const FeedbackUserPage: NextPageWithLayout = () => {
	return (
		<>
			<Head>
				<title>Обратная связь</title>
			</Head>
			<Box
				sx={theme => ({
					backgroundColor: theme.colors.brand[0],
				})}
				p="xl"
			>
				<Title order={2}>Оценка сотрудников</Title>
				<SimpleGrid
					className={styles.card}
					cols={2}
					breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
					mt="md"
				>
					<UserList />
					<UserCard
						image="https://avatars.githubusercontent.com/u/25126241?v=4"
						name="Александр"
						post="Руководитель отдела"
					/>
				</SimpleGrid>
			</Box>
		</>
	)
}

FeedbackUserPage.getLayout = function getLayout(page) {
	return <BaseLayout>{page}</BaseLayout>
}

export default FeedbackUserPage
