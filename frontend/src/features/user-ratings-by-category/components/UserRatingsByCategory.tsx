import { Stack } from '@mantine/core'
import { FormRating } from './FormRating'
import { ValueRating } from './ValueRating'

type FormProps = {
	formNames: { [key: string]: string }
	values?: undefined
	readOnly?: boolean
}
type ValuesProps = {
	values: { [key: string]: number }
	formNames?: undefined
	readOnly?: boolean
}

function UserRatingsByCategory(props: FormProps): JSX.Element
function UserRatingsByCategory(props: ValuesProps): JSX.Element
function UserRatingsByCategory(props: {
	readOnly?: boolean
	formNames?: { [key: string]: string }
	values?: { [key: string]: number }
}) {
	const { readOnly, formNames, values } = props

	if (formNames && values) {
		throw new Error('formNames and values props are mutually exclusive')
	}

	return (
		<Stack
			sx={() => ({
				maxWidth: 'max-content',
			})}
		>
			{values
				? Object.entries(values).map(([key, value], i) => (
						<ValueRating
							key={i}
							title={key}
							rating={value}
							readOnly={readOnly}
						/>
				  ))
				: null}
			{formNames
				? Object.entries(formNames).map(([key, value], i) => (
						<FormRating
							key={i}
							title={key}
							name={value}
							readOnly={readOnly}
						/>
				  ))
				: null}
		</Stack>
	)
}

export default UserRatingsByCategory
