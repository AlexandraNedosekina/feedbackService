import dayjs from 'dayjs'
import create from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

type State = {
	startDate: Date | null
	startTime: Date
	endDate: Date | null
	endTime: Date
	type: 'all' | 'one'
	isTwoWay: boolean
}

type Actions = {
	update: (value: {
		[key in keyof State]?: State[key]
	}) => void
	getIsEndDateAfter: () => boolean
	getIsEndTimeAfter: () => boolean
	getIsSameDates: () => boolean
	getIsStartTimeAfterNow: () => boolean
	getIsStartDateAfterNow: () => boolean
	getIsStartDateSame: () => boolean
	getIsDisabled: () => boolean
}

export const useCreateEventStore = create(
	devtools(
		immer<State & Actions>((set, get) => ({
			startDate: dayjs().toDate(),
			startTime: dayjs().add(1, 'hour').minute(0).toDate(),
			endDate: dayjs().add(1, 'month').toDate(),
			endTime: dayjs().startOf('day').toDate(),
			type: 'all',
			isTwoWay: false,
			getIsEndDateAfter: () => {
				const { startDate, endDate } = get()
				return dayjs(startDate).isBefore(endDate)
			},
			getIsEndTimeAfter: () => {
				const { startTime, endTime } = get()
				return dayjs(startTime).isBefore(endTime)
			},
			getIsSameDates: () => {
				const { startDate, endDate } = get()
				return dayjs(startDate).isSame(endDate, 'day')
			},
			getIsStartTimeAfterNow: () => {
				const { startTime } = get()
				return dayjs().isBefore(startTime)
			},
			getIsStartDateAfterNow: () => {
				const { startDate } = get()
				return dayjs().isBefore(startDate)
			},
			getIsStartDateSame: () => {
				const { startDate } = get()
				return dayjs().isSame(startDate, 'day')
			},
			getIsDisabled: () => {
				const {
					startDate,
					endDate,
					startTime,
					endTime,
					getIsEndDateAfter,
					getIsEndTimeAfter,
					getIsSameDates,
					getIsStartDateAfterNow,
					getIsStartTimeAfterNow,
					getIsStartDateSame,
				} = get()
				return (
					!startDate ||
					!endDate ||
					!startTime ||
					!endTime ||
					(!getIsEndDateAfter() && !getIsSameDates()) ||
					(!getIsEndTimeAfter() && getIsSameDates()) ||
					(!getIsStartTimeAfterNow() && getIsStartDateSame()) ||
					(!getIsStartDateAfterNow() && !getIsStartDateSame())
				)
			},
			update(value) {
				set(() => value)
			},
		}))
	)
)
