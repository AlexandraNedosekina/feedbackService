import { FC } from 'react'
import Buttons from './Buttons'
import SelectType from './SelectType'
import TimePicker from './TimePicker'

interface Props {
	onClose: () => void
}

const CreateEventModal: FC<Props> = ({ onClose }) => {
	return (
		<>
			<SelectType />
			<TimePicker />
			<Buttons onClose={onClose} />
		</>
	)
}

export default CreateEventModal
