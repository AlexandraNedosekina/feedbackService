/* eslint-disable react/display-name */
import { Field, FieldProps, FieldRenderProps } from 'react-final-form'

const withField = <T,>(
	Component: React.FC<T>,
	defaultFieldProps?: Omit<
		FieldProps<string, FieldRenderProps<string>>,
		'name'
	> & {
		name?: string
	}
) => {
	return (props: FieldProps<string, FieldRenderProps<string>> & T) => {
		const {
			name,
			validate,
			format,
			formatOnBlur,
			subscription,
			type,
			...rest
		} = props
		const fieldProps = {
			name,
			validate,
			format,
			formatOnBlur,
			subscription,
			type,
		}

		if (rest.maxLength) {
			fieldProps.validate = (value: string) => {
				const maxLengthError =
					value?.length > rest.maxLength
						? `Максимум ${rest.maxLength} символов`
						: undefined
				const validateError = validate ? validate(value) : undefined
				return maxLengthError || validateError
			}
		}

		return (
			<Field {...fieldProps} {...defaultFieldProps}>
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
