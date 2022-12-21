import create from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export interface ICareerGradeParam {
	id: string
	text: string
	isCreated: boolean
	isDeleted: boolean
	isEdited: boolean
}

type State = {
	title: string
	toLearn: ICareerGradeParam[]
	toComplete: ICareerGradeParam[]
	salary: number | null
	careerId?: string
	isEdit?: boolean
}

type Actions = {
	update: (value: {
		[key in keyof State]?: State[key]
	}) => void
	addParam: (type: 'toLearn' | 'toComplete', value: string) => void
	deleteParam: (type: 'toLearn' | 'toComplete', id: string) => void
	updateParam: (
		type: 'toLearn' | 'toComplete',
		id: string,
		value: string
	) => void
	restore: () => void
	getIsDisabled: () => boolean
}

const initialState: State = {
	title: '',
	salary: null,
	toLearn: [],
	toComplete: [],
	careerId: undefined,
	isEdit: false,
}

export const useAddCareerGrade = create(
	devtools(
		immer<State & Actions>(set => ({
			...initialState,
			update(value) {
				set(() => value)
			},
			addParam(type, value) {
				set(state => {
					state[type].push({
						id: Math.random().toString(36),
						text: value,
						isCreated: true,
						isDeleted: false,
						isEdited: false,
					})
				})
			},
			deleteParam(type, id) {
				set(state => {
					const index = state[type].findIndex(item => item.id === id)
					if (index !== -1) {
						state[type][index].isDeleted = true
					}
				})
			},
			updateParam(type, id, value) {
				set(state => {
					const index = state[type].findIndex(item => item.id === id)
					if (index !== -1) {
						state[type][index].text = value
						state[type][index].isEdited = true
					}
				})
			},
			restore() {
				set(() => initialState)
			},
			getIsDisabled() {
				const { title, toLearn, toComplete } = this
				return !title || !toLearn.length || !toComplete.length
			},
		}))
	)
)
