import { Group, Rating as MantineRating } from '@mantine/core'
import { FC } from 'react'
import { useField } from 'react-final-form'
import { IFormValues } from './types'

interface Props {
	title: string
	name: keyof IFormValues
}

export const Rating: FC<Props> = ({ title, name }) => {
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
