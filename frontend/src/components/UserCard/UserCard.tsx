import { UserButton } from '@components/UserButton/UserButton'

function UserCard() {
	return (
		<div>
			<UserButton
				image="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
				name="Иван Иванов"
				email="Backend-developer"
			/>
		</div>
	)
}

export default UserCard
