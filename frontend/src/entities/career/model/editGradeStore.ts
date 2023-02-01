import create from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

type State = {
	careerId?: string
	isEdit?: boolean
}

type Actions = {
	update: (value: {
		[key in keyof State]?: State[key]
	}) => void
	restore: () => void
}

const initialState: State = {
	careerId: undefined,
	isEdit: false,
}

export const useEditGrade = create(
	devtools(
		immer<State & Actions>(set => ({
			...initialState,
			update(value) {
				set(() => value)
			},
			restore() {
				set(() => initialState)
			},
		}))
	)
)
