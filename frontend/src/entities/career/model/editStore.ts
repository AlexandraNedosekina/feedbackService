import create from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

type State = {
	selectedGradeId: string
	grades: {
		label: string
		value: number
		isCompleted: boolean
		isCurrent: boolean
		isDefault: boolean
	}[]
}

type Actions = {
	update: (value: {
		[key in keyof State]?: State[key]
	}) => void
}

export const useEdit = create(
	devtools(
		immer<State & Actions>(set => ({
			selectedGradeId: '',
			grades: [],
			update(value) {
				set(() => value)
			},
		}))
	)
)
