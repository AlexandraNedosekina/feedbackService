import { ActionIcon, Flex, Stack, Text, Title } from '@mantine/core'
import { TimeInput } from '@mantine/dates'
import { useDebouncedValue } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import { useMutation } from '@tanstack/react-query'
import { useUser } from 'entities/user'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { updateUser } from 'shared/api'
import { Icon } from 'shared/ui'

const WorkHours = () => {
	const { user } = useUser()

	const startRef = useRef<HTMLInputElement>(null)
	const endRef = useRef<HTMLInputElement>(null)

	const [start, setStart] = useState<string | null>(user?.work_hours_start)
	const [end, setEnd] = useState<string | null>(user.work_hours_end)
	const [debouncedStart] = useDebouncedValue(start, 1200)
	const [debouncedEnd] = useDebouncedValue(end, 1200)

	const { mutate } = useMutation({
		mutationFn: (data: { start: string | null; end: string | null }) =>
			updateUser(user?.id, {
				work_hours_start: data.start || null,
				work_hours_end: data.end || null,
			}),
		onError(error) {
			if (error instanceof Error) {
				showNotification({
					title: 'Ошибка',
					message: error.message,
					color: 'red',
				})
			}
			setStart(user.work_hours_start)
			setEnd(user.work_hours_end)
		},
	})

	function onChange(type: 'start' | 'end') {
		return ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
			if (type === 'start') setStart(value)
			else setEnd(value)
		}
	}

	useEffect(() => {
		if (
			debouncedStart !== user.work_hours_start ||
			debouncedEnd !== user.work_hours_end
		) {
			mutate({ start: debouncedStart, end: debouncedEnd })
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedStart, debouncedEnd])

	return (
		<Stack spacing="xs">
			<Title order={2}>График работы</Title>
			<Flex gap="sm" align="center">
				<TimeInput
					ref={startRef}
					value={start || undefined}
					onChange={onChange('start')}
					rightSection={
						<ActionIcon onClick={() => startRef.current?.showPicker()}>
							<Icon icon="schedule" />
						</ActionIcon>
					}
				/>
				<Text>-</Text>
				<TimeInput
					ref={endRef}
					value={end || undefined}
					onChange={onChange('end')}
					rightSection={
						<ActionIcon onClick={() => endRef.current?.showPicker()}>
							<Icon icon="schedule" />
						</ActionIcon>
					}
				/>
			</Flex>
		</Stack>
	)
}

export default WorkHours
