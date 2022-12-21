import { TextInput } from '@mantine/core'
import { useAddCareerGrade } from 'src/stores'
import shallow from 'zustand/shallow'

const SalaryInput = () => {
	const { salary, update } = useAddCareerGrade(
		state => ({
			salary: state.salary,
			update: state.update,
		}),
		shallow
	)

	return (
		<TextInput
			label="Зарплата"
			value={salary || ''}
			onChange={e => update({ salary: +e.currentTarget.value })}
			type="number"
			autoComplete="off"
		/>
	)
}

export default SalaryInput
