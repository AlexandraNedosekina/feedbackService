import { Stack, Switch, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useMutation } from '@tanstack/react-query'
import { FC, useState } from 'react'
import { updateUser } from 'src/api'
import { useUser } from 'src/utils/useUser'

const Meeting: FC = () => {
	const { user } = useUser()
	const [isOn, setIsOn] = useState(!!user.meeting_readiness)

	const { mutate } = useMutation({
		mutationFn: (data: boolean) =>
			updateUser(user.id, { meeting_readiness: data }),
		onError(error) {
			if (error instanceof Error) {
				showNotification({
					title: 'Ошибка',
					message: error.message,
					color: 'red',
				})
			}
			setIsOn(!!user.meeting_readiness)
		},
	})

	function onChange(value: boolean) {
		setIsOn(value)
		mutate(value)
	}

	return (
		<Stack spacing={0}>
			<Title order={2}>Готовность к личным встречам</Title>
			<Switch
				checked={isOn}
				onChange={event => {
					onChange(event.currentTarget.checked)
				}}
			/>
		</Stack>
	)
}

export default Meeting
