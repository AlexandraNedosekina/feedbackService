import { Group, Rating as MantineRating } from '@mantine/core'
import { useField } from 'react-final-form'

interface IProps {
	title: string
	name: string
}

export const Rating = ({ title, name }: IProps) => {
	const { input } = useField(name)

	return (
		<Group position="apart">
			<div>{title}</div>
			<MantineRating
				size="md"
				value={input.value}
				onChange={input.onChange}
			/>
		</Group>
	)
}
