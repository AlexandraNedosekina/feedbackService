import { FormTextarea } from 'shared/ui'

interface IProps {
	label: string
	placeholder: string
	name: string
	disabled: boolean
}

export const Textarea = ({ name, label, placeholder, disabled }: IProps) => {
	return (
		<FormTextarea
			name={name}
			placeholder={placeholder}
			label={label}
			minRows={3}
			maxRows={8}
			autosize
			disabled={disabled}
			maxLength={1024}
		/>
	)
}
