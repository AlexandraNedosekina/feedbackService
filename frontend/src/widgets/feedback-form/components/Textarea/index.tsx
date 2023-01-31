import { FormTextarea } from 'shared/ui'

interface IProps {
	label: string
	placeholder: string
	name: string
}

export const Textarea = ({ name, label, placeholder }: IProps) => {
	return (
		<FormTextarea
			name={name}
			placeholder={placeholder}
			label={label}
			minRows={3}
			maxRows={8}
			autosize
		/>
	)
}
