/* eslint-disable react/display-name */
import { Field, FieldProps, FieldRenderProps } from 'react-final-form'

const withField = <T,>(Component: React.FC<T>) => {
	return (props: FieldProps<string, FieldRenderProps<string>> & T) => {
		const { name, validate, format, formatOnBlur, subscription, ...rest } =
			props
		const fieldProps = { name, validate, format, formatOnBlur, subscription }

		return (
			<Field {...fieldProps}>
				{({ input, meta }) => {
					return (
						<Component
							{...(rest as T)}
							{...input}
							error={meta.error && meta.touched ? meta.error : ''}
						/>
					)
				}}
			</Field>
		)
	}
}

export default withField
