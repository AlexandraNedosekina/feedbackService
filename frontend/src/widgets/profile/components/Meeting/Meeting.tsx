import { ActionIcon, Flex, Stack, Switch, Title, Tooltip } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useMutation } from '@tanstack/react-query'
import { useUser } from 'entities/user'
import { useState } from 'react'
import { updateUser } from 'shared/api'
import { Icon } from 'shared/ui'

const Meeting = () => {
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
			<Flex align="center" gap="xs">
				<Title order={2}>Готовность к личным встречам</Title>
				<Tooltip
					label="Готовность записываться на встречи через календарь"
					withArrow
					color="brand"
					width={200}
					multiline
				>
					<ActionIcon variant="light" color="brand" radius={100}>
						<Icon icon="question_mark" weight={400} />
					</ActionIcon>
				</Tooltip>
			</Flex>
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
