import { Avatar, Group, Stack, Text, Title } from '@mantine/core'

interface IProps {
	name: string
	jobTitle?: string
	avatar?: string
	variant?: 'default' | 'sm'
}

const UserInfoCard = ({
	name,
	jobTitle,
	avatar,
	variant = 'default',
}: IProps) => {
	const isDefaultVariant = variant === 'default'

	return (
		<Group>
			<Avatar
				src={avatar}
				size={isDefaultVariant ? 64 : 'lg'}
				radius={100}
			/>
			<Stack spacing={isDefaultVariant ? 5 : 0}>
				<Title order={isDefaultVariant ? 4 : 2} color="brand.5">
					{name}
				</Title>
				{jobTitle ? (
					<Text
						color={isDefaultVariant ? 'brand.5' : 'brand.4'}
						size={isDefaultVariant ? 15 : 14}
						weight={500}
					>
						{jobTitle}
					</Text>
				) : null}
			</Stack>
		</Group>
	)
}

export default UserInfoCard
