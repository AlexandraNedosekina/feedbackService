import { Box } from '@mantine/core'
import { UserSearchSelect } from 'features/user-search-select'
import { Field } from 'react-final-form'
import Checkbox from './Checkbox'

export default () => {
	return (
		<>
			<Box my="lg">
				<Field name="userIds">
					{({ input, meta }) => (
						<UserSearchSelect
							value={input.value}
							onChange={value => {
								input.onChange(value)
							}}
							error={meta.error && meta.touched ? meta.error : undefined}
							label="Сотрудники для оценки"
							multi
						/>
					)}
				</Field>
			</Box>
			<Checkbox />
		</>
	)
}
