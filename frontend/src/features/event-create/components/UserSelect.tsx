import { Box } from '@mantine/core'
import { UserSearchSelect } from 'features/user-search-select'
import { Field } from 'react-final-form'
import Checkbox from './Checkbox'

export default () => {
	return (
		<>
			<Checkbox />
			<Box my="lg">
				<Field name="userId">
					{({ input }) => (
						<UserSearchSelect
							onChange={value => {
								input.onChange(value)
							}}
						/>
					)}
				</Field>
			</Box>
		</>
	)
}
