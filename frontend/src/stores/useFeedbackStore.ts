import { FeedbackFromUser } from 'src/api/generatedTypes'
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { devtools } from 'zustand/middleware'

type State = FeedbackFromUser

type Actions = {
	update: (value: {
		[key in keyof FeedbackFromUser]?: FeedbackFromUser[key]
	}) => void
}

export const useFeedbackStore = create(
	devtools(
		immer<State & Actions>(set => ({
			task_completion: 0,
			involvement: 0,
			motivation: 0,
			interaction: 0,
			achievements: '',
			wishes: '',
			remarks: '',
			comment: '',
			update(value) {
				set(() => value)
			},
		}))
	)
)
