import { Flex } from '@mantine/core'
import Accept from './Accept'
import ChangeTime from './ChangeTime'
import Reject from './Reject'

interface IProps {
	eventId: number
}

export default function Actions({ eventId }: IProps) {
	return (
		<Flex gap="sm" justify={'end'}>
			<Accept eventId={eventId} />
			<ChangeTime eventId={eventId} />
			<Reject eventId={eventId} />
		</Flex>
	)
}
