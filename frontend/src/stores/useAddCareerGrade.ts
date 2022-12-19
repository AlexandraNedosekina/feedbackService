import create from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

type State = {
	title: string
	toLearn: string[]
	toComplete: string[]
	salary: number | null
}

type Actions = {
	update: (value: {
		[key in keyof State]?: State[key]
	}) => void
	restore: () => void
}

const initialState: State = {
	title: '',
	salary: null,
	toLearn: [],
	toComplete: [],
}

export const useAddCareerGrade = create(
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
