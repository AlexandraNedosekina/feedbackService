import { Container, Text } from '@mantine/core'
import Head from 'next/head'
import { useUser } from 'entities/user'
import { Profile } from 'widgets/profile'

export const ProfilePage = () => {
	const { user, isLoading } = useUser()

	if (isLoading || !user)
		return (
			<Container>
				<Text>Загрузка...</Text>
			</Container>
		)

	return (
		<Container py={{ base: 'md', xl: 'xl' }}>
			<Head>
				<title>Профиль</title>
			</Head>

			<Profile user={user} />
		</Container>
	)
}
