import { UserButton } from '@components/UserButton/UserButton'
import {
	Rating,
	Group,
	Stack,
	Textarea,
	SimpleGrid,
	Button,
} from '@mantine/core'

function UserCard() {
	return (
		<>
			<div>
				<UserButton
					image="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
					name="Иван Иванов"
					email="Backend-developer"
				/>
			</div>
			<Stack>
				<Group>
					<div>Выполнение задач</div>
					<Rating defaultValue={1.5} />
				</Group>
				<Group>
					<div>Вовлеченность</div>
					<Rating defaultValue={0} />
				</Group>
				<Group>
					<div>Мотивация</div>
					<Rating defaultValue={0} />
				</Group>
				<Group>
					<div>Взаимодействие с командой</div>
					<Rating defaultValue={0} />
				</Group>
			</Stack>
			<div>
				<Textarea
					placeholder="Опишите, какие успехи достигнуты"
					label="Достижения"
					withAsterisk
				/>
				<Textarea
					placeholder="Что можно сделать лучше"
					label="Пожелания"
					withAsterisk
				/>
				<Textarea
					placeholder="Что получилось не очень"
					label="Замечания"
					withAsterisk
				/>
				<Textarea
					placeholder="Любые комментарии"
					label="Комментарии"
					withAsterisk
				/>
			</div>
			<div>
				<SimpleGrid>
					<div>
						<Button>Сохранить</Button>
					</div>
					<div>
						<Button variant="default">Отмена</Button>
					</div>
				</SimpleGrid>
			</div>
		</>
	)
}

export default UserCard
