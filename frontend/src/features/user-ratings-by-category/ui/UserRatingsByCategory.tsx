import { Stack } from '@mantine/core'
import { Rating } from './Rating'
import { RatingReadonly } from './RatingReadonly'

type NoReadOnlyProps = {
	formNames: { [key: string]: string }
	readOnly?: false
}
type ReadOnlyProps = { values: { [key: string]: number }; readOnly: true }

function UserRatingsByCategory(props: NoReadOnlyProps): JSX.Element
function UserRatingsByCategory(props: ReadOnlyProps): JSX.Element
function UserRatingsByCategory(props: {
	readOnly?: boolean
	formNames?: { [key: string]: string }
	values?: { [key: string]: number }
}) {
	const { readOnly, formNames, values } = props

	if (readOnly && !values) {
		throw new Error('values prop is required in readonly mode')
	}
	if (!readOnly && !formNames) {
		throw new Error('formNames prop is required in non-readonly mode')
	}

	return (
		<Stack
			sx={() => ({
				maxWidth: 'max-content',
			})}
			my={40}
		>
			{readOnly && values
				? Object.entries(values).map(([key, value], i) => (
						<RatingReadonly key={i} title={key} rating={value} />
				  ))
				: !readOnly && formNames
				? Object.entries(formNames).map(([key, value], i) => (
						<Rating key={i} title={key} name={value} />
				  ))
				: null}
		</Stack>
	)
}

export default UserRatingsByCategory
