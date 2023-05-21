import { Group, Rating } from '@mantine/core'

interface IProps {
	title: string
	rating: number
	readOnly?: boolean
}

export const ValueRating = ({ title, rating, readOnly = true }: IProps) => {
	return (
		<Group position="apart">
			<div>{title}</div>
			<Rating fractions={3} size="md" value={rating} readOnly={readOnly} />
		</Group>
	)
}
