import { Group, Rating as MantineRating } from '@mantine/core'
import { useField } from 'react-final-form'

interface IProps {
	title: string
	name: string
	readOnly?: boolean
}

export const FormRating = ({ title, name, readOnly = false }: IProps) => {
	const { input } = useField(name)

	return (
		<Group position="apart">
			<div>{title}</div>
			<MantineRating
				size="md"
				value={input.value}
				onChange={readOnly ? undefined : input.onChange}
				readOnly={readOnly}
			/>
		</Group>
	)
}
