import {
	Avatar,
	Meeting,
	ProfileBadgesGroup,
	WorkFormat,
} from '@components/Profile'
import { Container, Group, Stack, Text, Title } from '@mantine/core'
import { TimeRangeInput } from '@mantine/dates'
import Head from 'next/head'
import { BaseLayout } from 'src/layouts'
import { useUser } from 'src/utils/useUser'
import { NextPageWithLayout } from './_app'

const ProfilePage: NextPageWithLayout = () => {
	const { user, isLoading } = useUser()

	// TODO: Add skeleton
	if (isLoading) return <div>Загрузка...</div>

	return (
		<Container>
			<Head>
				<title>Профиль</title>
			</Head>

			<Title mb="xl">Профиль</Title>

			<Group mb="xl">
				<Avatar />

				<Stack spacing={6}>
					<Text size={18}>{user?.full_name}</Text>
					<Text color="brand.5" weight={600} size={18}>
						{user?.job_title}
					</Text>
					<Text color="gray" size={14}>
						{user?.email}
					</Text>
					<Text color="gray" size={14}>
						День рождения: 12.08.1990 (32 года)
					</Text>
				</Stack>
			</Group>

			<Stack spacing={'xl'}>
				<ProfileBadgesGroup
					title="Навыки"
					badges={user.skills}
					api_key="skills"
				/>
				<ProfileBadgesGroup
					title="Факты о себе"
					badges={user.facts}
					api_key="facts"
				/>
				<ProfileBadgesGroup
					title="Ожидания"
					badges={user.job_expectations}
					api_key="job_expectations"
				/>

				<WorkFormat />

				<Stack spacing="xs">
					<Title order={2}>График работы</Title>
					<TimeRangeInput
						clearable
						sx={() => ({
							alignSelf: 'flex-start',
						})}
					/>
				</Stack>

				<Meeting />
			</Stack>
		</Container>
	)
}

ProfilePage.getLayout = function getLayout(page) {
	return <BaseLayout>{page}</BaseLayout>
}

export default ProfilePage
