import { Group, Rating } from '@mantine/core'

interface IProps {
	title: string
	rating: number
}

export const RatingReadonly = ({ title, rating }: IProps) => {
	return (
		<Group position="apart">
			<div>{title}</div>
			<Rating fractions={3} size="md" value={rating} readOnly />
		</Group>
	)
}
