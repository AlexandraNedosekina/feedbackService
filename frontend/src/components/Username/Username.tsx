import UserRating from '@components/UserRating'
import { Avatar, Group, Stack, Text, Title } from '@mantine/core'
import { FC } from 'react'

interface Props {
	name: string
	jobTitle?: string
	avatar?: string
	rating?: number
}

const Username: FC<Props> = ({ name, jobTitle, rating, avatar }) => {
	return (
		<Group>
			<Avatar src={avatar} size={64} radius={100} />
			<Stack spacing={5}>
				<Group spacing={'sm'}>
					<Title order={2} color="brand.5">
						{name}
					</Title>
					{rating ? <UserRating rating={rating} /> : null}
				</Group>
				{jobTitle ? <Text color="brand.5">{jobTitle}</Text> : null}
				<Text color="brand.5" weight={500}>
					Frontend
				</Text>
			</Stack>
		</Group>
	)
}

export default Username
