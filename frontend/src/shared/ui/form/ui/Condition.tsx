import { Field } from 'react-final-form'

interface IProps {
	when: string
	is: string | boolean
	children: JSX.Element
}

export default ({ is, when, children }: IProps) => {
	return (
		<Field name={when} subscription={{ value: true }}>
			{({ input: { value } }) => (value === is ? children : null)}
		</Field>
	)
}
