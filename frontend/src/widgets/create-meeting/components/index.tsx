import ModalWindow from './ModalWindow'

interface IProps {
	onCancel?: () => void
}

export default ({ onCancel }: IProps) => {
	return (
		<>
			<ModalWindow />
		</>
	)
}
