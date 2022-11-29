import {
	Avatar,
	Flex,
	Group,
	ScrollArea,
	Stack,
	Text,
	Title,
} from '@mantine/core'
import { FC } from 'react'
import { Buttons } from './Buttons'
import { Rating } from './Rating'
import { Textarea } from './Textarea'
import { useStyles } from './useStyles'

interface Props {
	image: string
	name: string
	post: string
}

const UserCard: FC<Props> = ({ image, name, post }) => {
	const { classes } = useStyles()

	return (
		<Flex direction={'column'} className={classes.root} gap="md">
			<ScrollArea>
				<Group>
					<Avatar src={image} size={64} radius={100} />
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
					<Rating title="Выполнение задач" name="task_completion" />
					<Rating title="Вовлеченность" name="involvement" />
					<Rating title="Мотивация" name="motivation" />
					<Rating title="Взаимодействие с командой" name="interaction" />
				</Stack>

				<Stack maw={'400px'} pb={1}>
					<Textarea
						placeholder="Опишите, какие успехи достигнуты"
						label="Достижения"
						name="achievements"
					/>
					<Textarea
						placeholder="Что можно сделать лучше"
						label="Пожелания"
						name="wishes"
					/>
					<Textarea
						placeholder="Что получилось не очень"
						label="Замечания"
						name="remarks"
					/>
					<Textarea
						placeholder="Любые комментарии"
						label="Комментарии"
						name="comment"
					/>
				</Stack>
			</ScrollArea>
			<Buttons />
		</Flex>
	)
}

export default UserCard
