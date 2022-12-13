import { Group, Rating as MantineRating } from '@mantine/core'
import { FC } from 'react'
import { FeedbackFromUser } from 'src/api/generatedTypes'
import { useFeedbackStore } from 'src/stores'

interface Props {
	title: string
	name: keyof Pick<
		FeedbackFromUser,
		'task_completion' | 'involvement' | 'motivation' | 'interaction'
	>
}

export const Rating: FC<Props> = ({ title, name }) => {
	const storeValue = useFeedbackStore(state => state[name])
	const update = useFeedbackStore(state => state.update)

	return (
		<Group position="apart">
			<div>{title}</div>
			<MantineRating
				size="md"
				value={storeValue}
				onChange={value => update({ [name]: value })}
			/>
		</Group>
	)
}
