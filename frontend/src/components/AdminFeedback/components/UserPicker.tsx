import { UserSearchSelect } from '@components/UserSearchSelect'
import { Flex, Select, Text } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { getAllEvents, QueryKeys } from 'src/api'
import { eventSelectMapper } from '../utils'

const UserPicker = () => {
	const { data, isLoading } = useQuery({
		queryKey: [QueryKeys.EVENTS],
		queryFn: getAllEvents,
	})
	const parsedEvents = (data && eventSelectMapper(data)) || []

	return (
		<Flex direction={'column'} h={'100%'}>
			<Text>Сотрудник</Text>
			<UserSearchSelect placeholder={'Введите имя сотрудника'} />

			<Text mt="md">Период сбора обратной связи</Text>
			<Select
				placeholder="Выберите период"
				defaultValue={'За все время'}
				data={[
					{ label: 'За все время', value: 'За все время' },
					...parsedEvents,
				]}
				disabled={isLoading}
				rightSection={null}
				rightSectionProps={{ style: { pointerEvents: 'all' } }}
			/>
		</Flex>
	)
}

export default UserPicker
