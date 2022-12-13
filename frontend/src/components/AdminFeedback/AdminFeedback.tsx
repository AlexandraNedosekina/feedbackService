import { Flex, Grid, Text, Title } from '@mantine/core'
import { FC } from 'react'
import styles from 'src/styles/feedback.module.sass'
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
					<Flex
						align="center"
						justify="center"
						sx={theme => ({
							height: '100%',
							padding: theme.spacing.xl,
							backgroundColor: 'white',
							borderRadius: '4px',
						})}
					>
						<Text color="brand" weight={600} size={19}>
							Выберите сотрудника для просмотра его оценок
						</Text>
					</Flex>
				</Grid.Col>
			</Grid>
		</div>
	)
}

export default AdminFeedback
