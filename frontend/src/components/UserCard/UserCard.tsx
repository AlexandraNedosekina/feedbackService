import {
	Avatar,
	Box,
	Button,
	Group,
	Rating,
	Stack,
	Text,
	Textarea,
	Title,
} from '@mantine/core'
import { FC } from 'react'
import { useStyles } from './useStyles'

interface Props {
	image: string
	name: string
	post: string
}

const UserCard: FC<Props> = ({ image, name, post }) => {
	const { classes } = useStyles()

	return (
		<Box className={classes.root}>
			<Group>
				<Avatar src={null} size={64} radius={100} />
				<Stack spacing={5}>
					<Title order={2} color="brand.5">
						{name}
					</Title>
					<Text color="brand.5">{post}</Text>
				</Stack>
			</Group>
			<Stack
				sx={() => ({
					maxWidth: 'max-content',
				})}
				my={40}
			>
				<Group position="apart">
					<div>Выполнение задач</div>
					<Rating defaultValue={1.5} size="md" />
				</Group>
				<Group position="apart">
					<div>Вовлеченность</div>
					<Rating defaultValue={0} size="md" />
				</Group>
				<Group position="apart">
					<div>Мотивация</div>
					<Rating defaultValue={0} size="md" />
				</Group>
				<Group position="apart">
					<div>Взаимодействие с командой</div>
					<Rating defaultValue={0} size="md" />
				</Group>
			</Stack>

			<Stack>
				<Textarea
					placeholder="Опишите, какие успехи достигнуты"
					label="Достижения"
				/>
				<Textarea placeholder="Что можно сделать лучше" label="Пожелания" />
				<Textarea placeholder="Что получилось не очень" label="Замечания" />
				<Textarea placeholder="Любые комментарии" label="Комментарии" />
			</Stack>

			<Group mt="xl">
				<Button>Сохранить</Button>
				<Button variant="default">Отмена</Button>
			</Group>
		</Box>
	)
}

export default UserCard
