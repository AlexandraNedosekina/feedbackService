import { SegmentedControl } from '@mantine/core'
import { Field } from 'react-final-form'

const data: { label: string; value: 'one' | 'all' }[] = [
	{ label: 'Общий', value: 'all' },
	{ label: 'Для 1 сотрудника', value: 'one' },
]

const SelectType = () => {
	return (
		<Field name="type">
			{({ input }) => (
				<SegmentedControl
					value={input.value}
					onChange={input.onChange}
					data={data}
					color="brand"
					size="md"
				/>
			)}
		</Field>
	)
}

export default SelectType
