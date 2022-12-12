import { Textarea as MantineTextarea } from '@mantine/core'
import { FC } from 'react'
import { FeedbackFromUser } from 'src/api/generatedTypes'
import { useFeedbackStore } from 'src/stores'

interface Props {
	label: string
	placeholder: string
	name: keyof Pick<
		FeedbackFromUser,
		'achievements' | 'comment' | 'remarks' | 'wishes'
	>
}

export const Textarea: FC<Props> = ({ name, label, placeholder }) => {
	const storeValue = useFeedbackStore(state => state[name])
	const update = useFeedbackStore(state => state.update)

	return (
		<MantineTextarea
			placeholder={placeholder}
			label={label}
			autosize={true}
			minRows={3}
			maxRows={8}
			value={storeValue || ''}
			onChange={event => update({ [name]: event.currentTarget.value })}
		/>
	)
}
