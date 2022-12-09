import { Checkbox, SegmentedControl, Text } from '@mantine/core'
import { FC } from 'react'
import { useCreateEventStore } from 'src/stores'
import shallow from 'zustand/shallow'

const data: { label: string; value: 'one' | 'all' }[] = [
	{ label: 'Общий', value: 'all' },
	{ label: 'Для 1 сотрудника', value: 'one' },
]

const SelectType: FC = () => {
	const { isTwoWay, type } = useCreateEventStore(
		state => ({
			type: state.type,
			isTwoWay: state.isTwoWay,
		}),
		shallow
	)
	const update = useCreateEventStore(state => state.update)

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
					<Checkbox
						checked={isTwoWay}
						onChange={() => update({ isTwoWay: !isTwoWay })}
						mt="md"
						label="Коллеги сотрудника смогут оценивать друг друга"
					/>
					<Text my="xl">Выбор сотрудника</Text>
				</>
			)}
		</>
	)
}

export default SelectType
