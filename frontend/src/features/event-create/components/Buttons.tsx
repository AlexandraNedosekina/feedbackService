import { Button, Flex } from '@mantine/core'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { createEvent, QueryKeys } from 'shared/api'
import { useCreateEventStore } from '../model'

interface IProps {
	onCancel?: () => void
}

const Buttons = ({ onCancel }: IProps) => {
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
			onCancel?.()
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
			{onCancel ? (
				<Button onClick={onCancel} variant="outline" ml="md">
					Отмена
				</Button>
			) : null}
		</Flex>
	)
}

export default Buttons
