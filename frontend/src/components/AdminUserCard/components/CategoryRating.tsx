import { Group, Rating } from '@mantine/core'
import { FC } from 'react'

interface Props {
	category: string
	rating: number
}

const CategoryRating: FC<Props> = ({ category, rating }) => {
	return (
		<Group position="apart">
			<div>{category}</div>
			<Rating fractions={3} size="md" value={rating} readOnly />
		</Group>
	)
}

export default CategoryRating
