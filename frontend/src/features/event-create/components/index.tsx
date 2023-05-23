import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Form } from 'react-final-form'
import { QueryKeys, createEvent } from 'shared/api'
import { FormCondition, FormInput, required } from 'shared/ui'
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
			name: string
			startDate: Date
			endDate: Date
			type: 'all' | 'one'
			isTwoWay?: boolean
			userIds?: number[]
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

		return mutateAsync({
			name: values.name,
			type: values.type,
			startDate: start,
			endDate: end,
			userIds: values?.userIds?.map(item => +item) ?? undefined,
			isTwoWay: values.twoWay,
		})
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

				if (values.type === 'one' && !values.userIds?.length) {
					errors.userIds = 'Обязательно'
				}

				return errors
			}}
		>
			{({ handleSubmit, submitError }) => (
				<>
					<SelectType />
					<FormInput
						mt="lg"
						name="name"
						label="Название"
						validate={required}
					/>
					<TimePicker />
					<FormCondition when={'type'} is="one">
						<UserSelect />
					</FormCondition>
					{submitError && <p>{submitError}</p>}
					<Buttons handleSubmit={handleSubmit} onCancel={onCancel} />
				</>
			)}
		</Form>
	)
}
