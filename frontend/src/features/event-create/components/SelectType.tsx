import { SegmentedControl } from '@mantine/core'
import { useEffect } from 'react'
import { Field, useFormState } from 'react-final-form'
import { IFormValues } from '../types'

const data: { label: string; value: 'one' | 'all' }[] = [
	{ label: 'Общий', value: 'all' },
	{ label: 'Индивидуальный', value: 'one' },
]

const SelectType = () => {
	const { values } = useFormState<IFormValues>()

	useEffect(() => {
		if (values.type === 'all' && !!values?.userIds?.length) {
			values.userIds = []
		}
	}, [values])

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
