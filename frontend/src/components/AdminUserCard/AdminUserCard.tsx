import {
	Avatar,
	Button,
	Group,
	Rating,
	ScrollArea,
	Stack,
	Text,
	Title,
} from '@mantine/core'
import { FC } from 'react'
import styles from './AdminUserCard.module.sass'

const AdminUserCard: FC = () => {
	return (
		<div className={styles.root}>
			<ScrollArea>
				<Group position="apart" align="flex-start">
					<Group>
						<Avatar src={null} size={64} radius={100} />
						<Stack spacing={5}>
							<Title order={2} color="brand.5">
								Admin
							</Title>
							<Text color="brand.5">Admin</Text>
						</Stack>
					</Group>
					<Button variant="outline">Архив</Button>
				</Group>

				<Stack
					sx={() => ({
						maxWidth: 'max-content',
					})}
					my={40}
				>
					<Text size={14}>Средние значения</Text>
					<Group position="apart">
						<div>Выполнение задач</div>
						<Rating size="md" value={1} />
					</Group>
					<Group position="apart">
						<div>Вовлеченность</div>
						<Rating size="md" value={2} />
					</Group>
					<Group position="apart">
						<div>Мотивация</div>
						<Rating size="md" value={3} />
					</Group>
					<Group position="apart">
						<div>Взаимодействие с командой</div>
						<Rating size="md" value={4} />
					</Group>
				</Stack>

				<Title order={3}>Коллеги</Title>
			</ScrollArea>
		</div>
	)
}

export default AdminUserCard
