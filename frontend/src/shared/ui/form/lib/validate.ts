import dayjs from 'dayjs'

export const required = (value: any) => {
	return value ? undefined : 'Обязательное поле'
}

export const startEndTime = ({
	startDate,
	startTime,
	endDate,
	endTime,
}: {
	startDate: string
	startTime: string
	endDate: string
	endTime: string
}): {
	startDate?: string
	startTime?: string
	endDate?: string
	endTime?: string
} => {
	const errors: Partial<
		Record<'startTime' | 'endTime' | 'startDate' | 'endDate', string>
	> = {}

	if (dayjs(startDate).isBefore(dayjs().startOf('day'))) {
		errors.startDate = 'Дата не может быть раньше текущей'
	}

	if (
		dayjs(startDate).isSame(dayjs().startOf('day')) &&
		+startTime.replace(':', '') < +dayjs().format('HHmm').replace(':', '')
	) {
		errors.startTime = 'Время не может быть раньше текущего'
	}

	if (dayjs(endDate).isBefore(startDate)) {
		errors.endDate = 'Окончание не может быть раньше начала'
	}

	if (
		dayjs(endDate).isSame(startDate) &&
		+startTime.replace(':', '') > +endTime.replace(':', '')
	) {
		errors.endTime = 'Окончание не может быть раньше начала'
	}

	return errors
}
