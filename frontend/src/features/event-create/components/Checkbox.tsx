import { Checkbox as MantineCheckbox } from '@mantine/core'
import { useCreateEventStore } from '../model'
import shallow from 'zustand/shallow'

const Checkbox = () => {
	const { isTwoWay, update } = useCreateEventStore(
		state => ({
			isTwoWay: state.isTwoWay,
			update: state.update,
		}),
		shallow
	)

	return (
		<MantineCheckbox
			checked={isTwoWay}
			onChange={() => update({ isTwoWay: !isTwoWay })}
			mt="md"
			label="Коллеги сотрудника смогут оценивать друг друга"
		/>
	)
}

export default Checkbox
