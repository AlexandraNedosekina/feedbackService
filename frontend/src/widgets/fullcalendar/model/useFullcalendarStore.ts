import { UserDetails } from 'shared/api/generatedTypes'
import create from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

type State = {
	eventForEdit?: {
		id: number
		start: Date
		end: Date
		user: UserDetails 
	}
}

type Actions = {
	update: (value: {
		[key in keyof State]?: State[key]
	}) => void
}

export const useFullcalendarStore = create(
	devtools(
		immer<State & Actions>(set => ({
			eventForEdit: undefined, 
			update(value) {
				set(() => value)
			},
		}))
	)
)
