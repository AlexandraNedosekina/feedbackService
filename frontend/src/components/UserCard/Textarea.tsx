import { Textarea as MantineTextarea } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { FC, useEffect, useState } from 'react'
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
	const update = useFeedbackStore(state => state.update)
	const [value, setValue] = useState('')
	const [debounced] = useDebouncedValue(value, 500)

	useEffect(() => {
		update({ [name]: debounced })
	}, [debounced])

	return (
		<MantineTextarea
			placeholder={placeholder}
			label={label}
			autosize={true}
			minRows={3}
			maxRows={8}
			value={value}
			onChange={event => setValue(event.currentTarget.value)}
		/>
	)
}
