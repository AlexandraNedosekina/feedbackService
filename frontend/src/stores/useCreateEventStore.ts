import dayjs from 'dayjs'
import create from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

type State = {
	startDate: Date
	startTime: Date
	endDate: Date
	endTime: Date
	type: 'all' | 'one'
	isTwoWay: boolean
}

type Actions = {
	update: (value: {
		[key in keyof State]?: State[key]
	}) => void
}

export const useCreateEventStore = create(
	devtools(
		immer<State & Actions>(set => ({
			startDate: dayjs().toDate(),
			startTime: dayjs().add(1, 'hour').toDate(),
			endDate: dayjs().add(1, 'month').toDate(),
			endTime: dayjs().startOf('day').toDate(),
			type: 'all',
			isTwoWay: false,
			update(value) {
				set(() => value)
			},
		}))
	)
)
