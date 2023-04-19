import { CareerTemplate } from 'shared/api/generatedTypes'
import { UpdateAction } from 'shared/types'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import create from 'zustand'

type State = {
	template: CareerTemplate | null
}

type Actions = {} & UpdateAction<State>

export const useTemplateStore = create(
	devtools(
		immer<State & Actions>(set => ({
			template: null,
			update(value) {
				set(() => value)
			},
		}))
	)
)
