import { Group, Rating, Text } from '@mantine/core'

interface IProps {
	rating: number
	withBorder?: boolean
}

const UserRating = ({ withBorder, rating }: IProps) => {
	return (
		<Group
			spacing={5}
			sx={theme => ({
				borderRadius: '4px',
				border: withBorder ? `1px solid ${theme.colors.brand[2]}` : 'none',
				backgroundColor: 'white',
			})}
			px={4}
			py={2}
		>
			<Rating count={1} readOnly value={1} size="sm" />
			<Text size={16} weight={400} color="black">
				{rating}
			</Text>
		</Group>
	)
}

export default UserRating
