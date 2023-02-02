import Buttons from './Buttons'
import SelectType from './SelectType'
import TimePicker from './TimePicker'

interface IProps {
	onCancel?: () => void
}

export default ({ onCancel }: IProps) => {
	return (
		<>
			<SelectType />
			<TimePicker />
			<Buttons onCancel={onCancel} />
		</>
	)
}
