import Accept from './Accept'
import ChangeTime from './ChangeTime'
import Reject from './Reject'

interface IProps {
	eventId: number
	start: string
	end: string
}

export default function Actions({ eventId, end, start }: IProps) {
	return (
		<>
			<Accept eventId={eventId} />
			<ChangeTime eventId={eventId} start={start} end={end} />
			<Reject eventId={eventId} />
		</>
	)
}
