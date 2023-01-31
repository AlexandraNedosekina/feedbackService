import create from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

type State = {
	userId: string
	eventId: string
}

type Actions = {
	update: (value: {
		[key in keyof State]?: State[key]
	}) => void
}

export const useAdminFeedbackStore = create(
	devtools(
		immer<State & Actions>(set => ({
			userId: '',
			eventId: 'all',
			update(value) {
				set(() => value)
			},
		}))
	)
)
