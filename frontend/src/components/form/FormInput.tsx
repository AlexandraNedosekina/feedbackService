import { TextInput, TextInputProps } from '@mantine/core'
import { FC } from 'react'
import { Field, FieldProps, FieldRenderProps } from 'react-final-form'

interface Props<T = string> {
	fieldProps: FieldProps<T, FieldRenderProps<T>>
	errorInput?: (props: FieldRenderProps<T>) => string
	inputProps?: TextInputProps
}

const FormInput: FC<Props> = ({ fieldProps, inputProps }) => {
	return (
		<Field {...fieldProps}>
			{props => (
				<TextInput
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

export default FormInput
