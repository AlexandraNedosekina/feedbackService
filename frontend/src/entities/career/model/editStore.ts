import { UpdateAction } from 'shared/types'
import create from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

type State = {
	selectedGradeId: string | number
	grades: {
		label: string
		value: number | string
		isCompleted?: boolean
		isCurrent?: boolean
		isDefault?: boolean
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
