import { UserDetails } from 'shared/api/generatedTypes'
import { UpdateAction } from 'shared/types'
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

type Actions = {} & UpdateAction<State>

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
