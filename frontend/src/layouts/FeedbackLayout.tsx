import UserList from '@components/UserList'
import { Grid, Title } from '@mantine/core'
import { FC } from 'react'
import styles from '../styles/feedback.module.sass'
import FeedbackUserList from 'widgets/feedback-user-list'

interface Props {
	children: JSX.Element | JSX.Element[]
}

const FeedbackLayout: FC<Props> = ({ children }) => {
	return (
		<div className={styles.wrapper}>
			<Title order={2}>Оценка сотрудников</Title>
			<Grid className={styles.card} columns={4} mt="md">
				<Grid.Col span={1} h={'100%'} py={0}>
					{/*<UserList />*/}
					<FeedbackUserList />
				</Grid.Col>

				<Grid.Col span={3} h={'100%'} py={0}>
					{children}
				</Grid.Col>
			</Grid>
		</div>
	)
}

export default FeedbackLayout
