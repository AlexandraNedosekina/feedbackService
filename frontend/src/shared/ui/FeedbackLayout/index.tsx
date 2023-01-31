import { Grid, Title } from '@mantine/core'
import styles from './styles.module.sass'

interface IProps {
	left: JSX.Element
	right: JSX.Element
}

export const FeedbackLayout = ({ left, right }: IProps) => {
	return (
		<div className={styles.wrapper}>
			<Title order={2}>Оценка сотрудников</Title>
			<Grid className={styles.card} columns={4} mt="md">
				<Grid.Col span={1} h={'100%'} py={0}>
					{left}
				</Grid.Col>

				<Grid.Col span={3} h={'100%'} py={0}>
					{right}
				</Grid.Col>
			</Grid>
		</div>
	)
}
