import { TextareaProps, Textarea } from '@mantine/core'
import { FC } from 'react'
import { Field, FieldProps, FieldRenderProps } from 'react-final-form'

interface Props<T = string> {
	fieldProps: FieldProps<T, FieldRenderProps<T>>
	errorInput?: (props: FieldRenderProps<T>) => string
	textareaProps?: TextareaProps
}

const FormTextarea: FC<Props> = ({ fieldProps, textareaProps: inputProps }) => {
	return (
		<Field {...fieldProps}>
			{props => (
				<Textarea
					error={
						props.meta.error && props.meta.touched ? props.meta.error : ''
					}
					{...inputProps}
					{...props.input}
				/>
			)}
		</Field>
	)
}

export default FormTextarea
