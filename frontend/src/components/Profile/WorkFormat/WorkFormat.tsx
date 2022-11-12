import { Select, Stack, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useMutation } from '@tanstack/react-query'
import { FC, useState } from 'react'
import { updateUser } from 'src/api'
import { User } from 'src/api/generatedTypes'
import { useUser } from 'src/utils/useUser'

const workFormatData: Array<{
	label: string
	value: Exclude<User['work_format'], undefined>
}> = [
	{
		label: 'В офисе',
		value: 'office',
	},
	{
		label: 'Удаленно',
		value: 'home',
	},
	{
		label: 'Гибрид',
		value: 'part',
	},
]

interface Props {}

const WorkFormat: FC<Props> = () => {
	const { user } = useUser()
	const [value, setValue] = useState(user?.work_format || null)

	const { mutate } = useMutation({
		mutationFn: (data: User['work_format']) =>
			updateUser(user?.id, {
				work_format: data,
			}),
		onError(error) {
			if (error instanceof Error) {
				showNotification({
					title: 'Ошибка',
					message: error.message,
					color: 'red',
				})
			}
			setValue(user?.work_format || null)
		},
	})

	function onChange(value: Exclude<User['work_format'], undefined>) {
		setValue(value)
		mutate(value)
	}

	return (
		<Stack spacing={'xs'}>
			<Title order={2}>Формат работы</Title>

			<Select
				sx={() => ({
					alignSelf: 'flex-start',
				})}
				value={value}
				data={workFormatData}
				placeholder="Выберите формат работы"
				onChange={onChange}
			/>
		</Stack>
	)
}

export default WorkFormat
