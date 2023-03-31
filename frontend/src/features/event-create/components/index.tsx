import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { FORM_ERROR } from 'final-form'
import { Form, FormSpy } from 'react-final-form'
import { createEvent, QueryKeys } from 'shared/api'
import { FormCondition } from 'shared/ui'
import { IFormValues } from '../types'
import Buttons from './Buttons'
import SelectType from './SelectType'
import TimePicker from './TimePicker'
import UserSelect from './UserSelect'

interface IProps {
	onCancel?: () => void
}

export default ({ onCancel }: IProps) => {
	const queryClient = useQueryClient()

	const { mutateAsync } = useMutation({
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
		},
	})

	async function handleSubmit(values: IFormValues) {
		const [startHours, startMinutes] = values.startTime.split(':')
		const [endHours, endMinutes] = values.endTime.split(':')
		const start = dayjs(values.startDate)
			.set('hours', +startHours)
			.set('minutes', +startMinutes)
			.toDate()
		const end = dayjs(values.endDate)
			.set('hours', +endHours)
			.set('minutes', +endMinutes)
			.toDate()

		return { [FORM_ERROR]: 'something went wrong' }

		//return mutateAsync({
		//type: values.type,
		//startDate: start,
		//endDate: end,
		//userId: values.userId,
		//isTwoWay: values.twoWay,
		//}).catch(() => ({ [FORM_ERROR]: 'something went wrong' }))
	}

	return (
		<Form<IFormValues>
			onSubmit={handleSubmit}
			subscription={{ pristine: true, values: true }}
			keepDirtyOnReinitialize
			initialValues={{
				type: 'all',
				startTime: dayjs().add(1, 'hour').set('minutes', 0).format('HH:mm'),
				//@ts-expect-error initial value must be type of Date
				startDate: dayjs().startOf('day').toDate(),
				endTime: dayjs().startOf('day').format('HH:mm'),
				//@ts-expect-error initial value must be type of Date
				endDate: dayjs().add(2, 'weeks').startOf('day').toDate(),
				twoWay: false,
			}}
			validate={values => {
				const errors: Partial<Record<keyof IFormValues, string>> = {}

				if (
					dayjs(values.endDate).isBefore(values.startDate) ||
					(dayjs(values.endDate).isSame(values.startDate) &&
						+values.startTime.replace(':', '') >
						+values.endTime.replace(':', ''))
				) {
					errors.endDate = 'Окончание не может быть раньше начала'
				}

				return errors
			}}
		>
			{({ handleSubmit, submitError }) => (
				<>
					<FormSpy>
						{({ values }) => <pre>{JSON.stringify(values, null, 2)}</pre>}
					</FormSpy>
					<SelectType />
					<FormCondition when={'type'} is="one">
						<UserSelect />
					</FormCondition>
					<TimePicker />
					{submitError && <p>{submitError}</p>}
					<Buttons handleSubmit={handleSubmit} onCancel={onCancel} />
				</>
			)}
		</Form>
	)
}
