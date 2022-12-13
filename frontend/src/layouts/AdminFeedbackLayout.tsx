import AdminUserList from '@components/AdminUserList'
import { Grid, Group, Select, Title } from '@mantine/core'
import { FC } from 'react'
import styles from '../styles/feedback.module.sass'

interface Props {
	children: JSX.Element | JSX.Element[]
}

const AdminFeedbackLayout: FC<Props> = ({ children }) => {
	return (
		<div className={styles.wrapper}>
			{/* TODO create another component */}
			<Group>
				<Title order={2}>Оценка сотрудников</Title>
				<Select defaultValue={'one'} data={['one', 'two']} size="xs" />
			</Group>
			<Grid className={styles.card} columns={4} mt="md">
				<Grid.Col span={1} h={'100%'} py={0}>
					<AdminUserList />
				</Grid.Col>
				<Grid.Col span={3} h={'100%'} py={0}>
					{children}
				</Grid.Col>
			</Grid>
		</div>
	)
}

export default AdminFeedbackLayout
