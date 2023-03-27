import dayjs from 'dayjs'
import { Form } from 'react-final-form'
import { IFormValues } from '../types'
import Buttons from './Buttons'
import SelectType from './SelectType'
import TimePicker from './TimePicker'

interface IProps {
	onCancel?: () => void
}

export default ({ onCancel }: IProps) => {
	function handleSubmit(values: IFormValues) {
		throw new Error('Function not implemented.')
	}

	return (
		<Form<IFormValues>
			onSubmit={handleSubmit}
			subscription={{ pristine: true, values: true }}
			initialValues={{
				type: 'all',
				startTime: dayjs().toISOString(),
				endTime: dayjs().add(2, 'weeks').toISOString(),
			}}
		>
			{() => (
				<>
					<SelectType />
					<TimePicker />
					<Buttons onCancel={onCancel} />
				</>
			)}
		</Form>
	)
}
