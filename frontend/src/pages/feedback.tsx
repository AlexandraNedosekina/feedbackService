import { SimpleGrid, Title, Text } from '@mantine/core'
import Head from 'next/head'
import { BaseLayout } from 'src/layouts'
import { NextPageWithLayout } from './_app'
import { UserButton } from '@components/UserButton/UserButton'
import styles from 'src/styles/main.module.scss'

const FeedbackPage: NextPageWithLayout = () => {
	return (
		<>
			<Head>
				<title>Обратная связь</title>
			</Head>
			<SimpleGrid
				className={styles.card}
				cols={2}
				breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
			>
				<div>
					<Title size={19}>Оценка сотрудников</Title>
					<UserButton
						image="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
						name="Иван Иванов"
						email="Backend-developer"
					/>
					<UserButton
						image="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
						name="Анастасия Иванова"
						email="Аналитик"
					/>
					<UserButton
						image="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
						name="Иван Иванов"
						email="Backend-developer"
					/>
					<UserButton
						image="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
						name="Иван Иванов"
						email="Backend-developer"
					/>
					<UserButton
						image="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
						name="Иван Иванов"
						email="Backend-developer"
					/>
				</div>
				<SimpleGrid className={styles.info}>
					<Text className={styles.info_text}>
						Выберите сотрудника для оценки
					</Text>

					<div></div>
				</SimpleGrid>
			</SimpleGrid>
		</>
	)
}

FeedbackPage.getLayout = function getLayout(page) {
	return <BaseLayout>{page}</BaseLayout>
}

export default FeedbackPage
