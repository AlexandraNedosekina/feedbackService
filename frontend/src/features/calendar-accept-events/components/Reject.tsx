import { Button, Flex, Modal, Text, TextInput } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { QueryKeys, rejectCalendarEvent } from 'shared/api'
import ActionTemplate from './ActionTemplate'

interface IProps {
	eventId: number
}

export default function ({ eventId }: IProps) {
	const [isOpen, modalHandlers] = useDisclosure(false)
	const [rejectionCause, setRejectionCause] = useState<string>()

	const queryClient = useQueryClient()
	const { mutate, isLoading } = useMutation({
		mutationFn: () =>
			rejectCalendarEvent(eventId, { rejection_cause: rejectionCause }),
		onSuccess: () => {
			modalHandlers.close()
			showNotification({
				title: 'Успешно',
				message: 'Встреча отклонена',
				color: 'green',
			})
			queryClient.invalidateQueries([QueryKeys.CALENDAR])
		},
	})

	return (
		<>
			<ActionTemplate
				onClick={modalHandlers.open}
				icon="close"
				color="red"
				tooltipText="Отменить встречу"
			/>
			<Modal
				opened={isOpen}
				onClose={modalHandlers.close}
				title="Вы действительно хотите отклонить встречу?"
				zIndex={500}
			>
				<TextInput
					value={rejectionCause}
					onChange={e => setRejectionCause(e.currentTarget.value)}
					label={
						<Text>
							Причина:{' '}
							<Text color="gray.6" weight="normal" span>
								(необязательно)
							</Text>
						</Text>
					}
				/>

				<Flex mt="lg" justify={'end'} gap="md">
					<Button color="red" loading={isLoading} onClick={() => mutate()}>
						Отклонить
					</Button>
				</Flex>
			</Modal>
		</>
	)
}
