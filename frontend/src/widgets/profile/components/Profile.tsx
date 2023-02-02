import { Group, Stack, Text, Title } from '@mantine/core'
import { AvatarUpload } from 'features/avatar-upload'
import { TUserAdapter } from 'shared/api'
import { BadgesGroup } from './BadgesGroup'
import Meeting from './Meeting'
import WorkFormat from './WorkFormat'
import WorkHours from './WorkHours'

interface IProps {
	user: TUserAdapter
}

const Profile = ({ user }: IProps) => {
	return (
		<>
			<Title mb="xl">Профиль</Title>

			<Group mb="xl">
				<AvatarUpload />

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
				<BadgesGroup
					title="Навыки"
					badges={user?.skills}
					api_key="skills"
				/>
				<BadgesGroup
					title="Факты о себе"
					badges={user?.facts}
					api_key="facts"
				/>
				<BadgesGroup
					title="Ожидания"
					badges={user?.job_expectations}
					api_key="job_expectations"
				/>
				<WorkFormat />
				<WorkHours />
				<Meeting />
			</Stack>
		</>
	)
}

export default Profile
