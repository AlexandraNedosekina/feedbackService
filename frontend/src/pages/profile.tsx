import {
	Avatar,
	Meeting,
	ProfileBadgesGroup,
	WorkFormat,
	WorkHours,
} from '@components/Profile'
import { Container, Group, Stack, Text, Title } from '@mantine/core'
import Head from 'next/head'
import { BaseLayout } from 'src/layouts'
import { useUser } from 'src/utils/useUser'
import { NextPageWithLayout } from './_app'

const ProfilePage: NextPageWithLayout = () => {
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

			<Title mb="xl">Профиль</Title>

			<Group mb="xl">
				<Avatar />

				<Stack spacing={6}>
					<Text size={18}>{user?.full_name}</Text>
					{user?.job_title && (
						<Text color="brand.5" weight={600} size={18}>
							{user.job_title}
						</Text>
					)}
					{user?.email && (
						<Text color="gray" size={14}>
							{user.email}
						</Text>
					)}
					{user?.date_of_birth && (
						<Text color="gray" size={14}>
							День рождения: {user.date_of_birth}
						</Text>
					)}
				</Stack>
			</Group>

			<Stack spacing={'xl'}>
				<ProfileBadgesGroup
					title="Навыки"
					badges={user?.skills}
					api_key="skills"
				/>
				<ProfileBadgesGroup
					title="Факты о себе"
					badges={user?.facts}
					api_key="facts"
				/>
				<ProfileBadgesGroup
					title="Ожидания"
					badges={user?.job_expectations}
					api_key="job_expectations"
				/>
				<WorkFormat />
				<WorkHours />
				<Meeting />
			</Stack>
		</Container>
	)
}

ProfilePage.getLayout = function getLayout(page) {
	return <BaseLayout>{page}</BaseLayout>
}

export default ProfilePage
