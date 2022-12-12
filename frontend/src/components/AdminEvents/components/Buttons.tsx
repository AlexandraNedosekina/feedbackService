import { Button, Flex } from '@mantine/core'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { FC } from 'react'
import { createEvent, QueryKeys } from 'src/api'
import { useCreateEventStore } from 'src/stores'

interface Props {
	onClose: () => void
}

const Buttons: FC<Props> = ({ onClose }) => {
	const {
		startDate,
		endDate,
		endTime,
		isTwoWay,
		startTime,
		type,
		userId,
		getIsDisabled,
		restore,
	} = useCreateEventStore()
	const queryClient = useQueryClient()

	const { mutate, isLoading } = useMutation({
		mutationFn: (data: {
			startDate: Date
			endDate: Date
			type: 'all' | 'one'
			isTwoWay?: boolean
			userId?: string
		}) => createEvent(data),
		onSuccess: () => {
			queryClient.invalidateQueries([QueryKeys.EVENTS])
			onClose()
			restore()
		},
	})

	function handleCreate() {
		const start = dayjs(startDate)
			.hour(startTime.getHours())
			.minute(startTime.getMinutes())
			.toDate()
		const end = dayjs(endDate)
			.hour(endTime.getHours())
			.minute(endTime.getMinutes())
			.toDate()

		mutate({
			startDate: start,
			endDate: end,
			type,
			isTwoWay,
			userId,
		})
	}

	return (
		<Flex justify={'flex-end'} mt="lg">
			<Button
				onClick={handleCreate}
				loading={isLoading}
				disabled={getIsDisabled()}
			>
				Создать
			</Button>
			<Button onClick={onClose} variant="outline" ml="md">
				Отмена
			</Button>
		</Flex>
	)
}

export default Buttons
