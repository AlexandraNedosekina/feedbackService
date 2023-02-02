import { Stack, Title } from '@mantine/core'
import { TimeRangeInput } from '@mantine/dates'
import { useDebouncedValue } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import { useMutation } from '@tanstack/react-query'
import { useUser } from 'entities/user'
import { useEffect, useState } from 'react'
import { updateUser } from 'shared/api'

const WorkHours = () => {
	const { user } = useUser()

	const [value, setValue] = useState<[Date | null, Date | null]>([
		user?.work_hours_start,
		user?.work_hours_end,
	])
	const [debouncedValue] = useDebouncedValue(value, 1200)

	const { mutate } = useMutation({
		mutationFn: (data: [Date | null, Date | null]) =>
			updateUser(user?.id, {
				work_hours_start: data[0]?.toTimeString().split(' ')[0] || null,
				work_hours_end: data[1]?.toTimeString().split(' ')[0] || null,
			}),
		onError(error) {
			if (error instanceof Error) {
				showNotification({
					title: 'Ошибка',
					message: error.message,
					color: 'red',
				})
			}
			setValue([user?.work_hours_start, user?.work_hours_end])
		},
	})

	function onChange(value: [Date, Date]) {
		setValue(value)
	}

	useEffect(() => {
		if (
			debouncedValue[0] !== user?.work_hours_start &&
			debouncedValue[1] !== user?.work_hours_end
		) {
			mutate(debouncedValue)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedValue])

	return (
		<Stack spacing="xs">
			<Title order={2}>График работы</Title>
			<TimeRangeInput
				clearable
				sx={() => ({
					alignSelf: 'flex-start',
				})}
				value={value}
				onChange={onChange}
				styles={{
					input: {
						['.mantine-Input-input']: {
							border: 'none',
						},
					},
				}}
			/>
		</Stack>
	)
}

export default WorkHours
