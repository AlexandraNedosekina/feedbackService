import create from 'zustand'
import { UpdateAction } from 'shared/types'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

type State = {
	selectedGradeId: string
	grades: {
		label: string
		value: number | string
		isCompleted?: boolean
		isCurrent?: boolean
	}[]
}

type Actions = {} & UpdateAction<State>

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
