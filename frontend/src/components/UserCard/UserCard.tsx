import {
	Avatar,
	Button,
	Flex,
	Group,
	Rating,
	ScrollArea,
	Stack,
	Text,
	Textarea,
	TextareaProps,
	Title,
} from '@mantine/core'
import router from 'next/router'
import { FC } from 'react'
import { useStyles } from './useStyles'

interface Props {
	image: string
	name: string
	post: string
}

const textareaConfig: TextareaProps = {
	autosize: true,
	minRows: 3,
	maxRows: 8,
}

const UserCard: FC<Props> = ({ image, name, post }) => {
	const { classes } = useStyles()

	function goToEmpty() {
		router.push('/feedback/')
	}

	return (
		<Flex direction={'column'} className={classes.root} gap="md">
			<ScrollArea>
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
						<Rating defaultValue={0} size="md" />
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

				<Stack maw={'40%'}>
					<Textarea
						placeholder="Опишите, какие успехи достигнуты"
						label="Достижения"
						{...textareaConfig}
					/>
					<Textarea
						placeholder="Что можно сделать лучше"
						label="Пожелания"
						{...textareaConfig}
					/>
					<Textarea
						placeholder="Что получилось не очень"
						label="Замечания"
						{...textareaConfig}
					/>
					<Textarea
						placeholder="Любые комментарии"
						label="Комментарии"
						{...textareaConfig}
						pb={1}
					/>
				</Stack>
			</ScrollArea>
			<Group>
				<Button>Сохранить</Button>
				<Button
					variant="outline"
					style={{ background: 'white' }}
					onClick={goToEmpty}
				>
					Отмена
				</Button>
			</Group>
		</Flex>
	)
}

export default UserCard
