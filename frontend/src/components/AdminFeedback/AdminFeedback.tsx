import AdminUserCard from '@components/AdminUserCard'
import { Grid, Title } from '@mantine/core'
import { FC } from 'react'
import styles from 'styles/feedback.module.sass'
import { UserPicker } from './components'

const AdminFeedback: FC = () => {
	return (
		<div className={styles.wrapper}>
			<Title order={2}>Оценка сотрудников</Title>
			<Grid className={styles.card} columns={4} mt="md">
				<Grid.Col span={1} h={'100%'} py={0}>
					<UserPicker />
				</Grid.Col>
				<Grid.Col span={3} h={'100%'} py={0}>
					<AdminUserCard />
				</Grid.Col>
			</Grid>
		</div>
	)
}

export default AdminFeedback
