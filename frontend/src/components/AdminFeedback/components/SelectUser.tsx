import { UserSearchSelect } from '@components/UserSearchSelect'
import { Text } from '@mantine/core'
import { useAdminFeedbackStore } from 'src/stores'
import shallow from 'zustand/shallow'

const SelectEvent = () => {
	const { update, userId } = useAdminFeedbackStore(
		state => ({
			userId: state.userId,
			update: state.update,
		}),
		shallow
	)

	return (
		<>
			<Text>Сотрудник</Text>
			<UserSearchSelect
				value={userId}
				onChange={userId => update({ userId })}
				placeholder={'Введите имя сотрудника'}
			/>
		</>
	)
}

export default SelectEvent
