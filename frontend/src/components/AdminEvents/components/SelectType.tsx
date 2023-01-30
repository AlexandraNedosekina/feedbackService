import { UserSearchSelect } from '@components/UserSearchSelect'
import { Box, SegmentedControl } from '@mantine/core'
import { FC } from 'react'
import { useCreateEventStore } from 'stores'
import shallow from 'zustand/shallow'
import Checkbox from './Checkbox'

const data: { label: string; value: 'one' | 'all' }[] = [
	{ label: 'Общий', value: 'all' },
	{ label: 'Для 1 сотрудника', value: 'one' },
]

const SelectType: FC = () => {
	const { type, update } = useCreateEventStore(
		state => ({
			type: state.type,
			update: state.update,
		}),
		shallow
	)

	return (
		<>
			<SegmentedControl
				value={type}
				onChange={(value: 'one' | 'all') => update({ type: value })}
				data={data}
				color="brand"
				size="md"
			/>
			{type === 'one' && (
				<>
					<Checkbox />
					<Box my="lg">
						<UserSearchSelect
							onChange={value => {
								update({ userId: value })
							}}
						/>
					</Box>
				</>
			)}
		</>
	)
}

export default SelectType
