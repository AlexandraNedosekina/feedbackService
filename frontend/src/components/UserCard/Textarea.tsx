import { FormTextarea } from '@components/form'
import { FC } from 'react'
import { IFormValues } from './types'

interface Props {
	label: string
	placeholder: string
	name: keyof IFormValues
}

export const Textarea: FC<Props> = ({ name, label, placeholder }) => {
	return (
		<FormTextarea
			fieldProps={{
				name,
			}}
			textareaProps={{
				placeholder,
				label,
				autosize: true,
				minRows: 3,
				maxRows: 8,
			}}
		/>
	)
}
