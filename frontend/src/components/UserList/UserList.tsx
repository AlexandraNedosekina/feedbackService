import Search from '@components/SearchBar/SearchBar'
import UserButton from '@components/UserButton'
import { Box } from '@mantine/core'
import { useRouter } from 'next/router'
import { FC } from 'react'

const users = [
	{
		id: 1,
		image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80',
		name: 'Иван Иванов',
		email: 'Backend-developer',
	},
	{
		id: 2,
		image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80',
		name: 'Иван Иванов',
		email: 'Backend-developer',
	},
	{
		id: 3,
		image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80',
		name: 'Иван Иванов',
		email: 'Backend-developer',
	},
	{
		id: 4,
		image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80',
		name: 'Иван Иванов',
		email: 'Backend-developer',
	},
	{
		id: 5,
		image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80',
		name: 'Иван Иванов',
		email: 'Backend-developer',
	},
]

interface Props {}

const UserList: FC<Props> = () => {
	const {
		query: { userId },
	} = useRouter()

	return (
		<div>
			<div>
				<Search />
			</div>
			<Box mt="md">
				{users.map(user => (
					<UserButton
						key={user.id}
						image={user.image}
						name={user.name}
						post={user.email}
						userId={user.id}
						isActive={+(userId as string) === user.id}
					/>
				))}
			</Box>
		</div>
	)
}

export default UserList
