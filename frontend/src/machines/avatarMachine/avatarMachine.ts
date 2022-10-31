import { assign, createMachine } from 'xstate'
import { AvatarContext, AvatarEvent, AvatarTypestate } from './types'

const avatarMachine = createMachine<
	AvatarContext,
	AvatarEvent,
	AvatarTypestate
>(
	{
		id: 'avatar',
		initial: 'initial',
		context: {
			initial: {
				url: '',
				thumbnailUrl: '',
				thumbnail: '',
			},
			url: '',
			thumbnailUrl: '',
			thumbnail: '',
			isUploadedImageEdited: true,
		},
		states: {
			initial: {
				entry: ['setInitialContext'],
				on: {
					CHANGE_THUMBNAIL: {
						target: 'changeThumbnail',
					},
				},
			},
			uploadingAvatar: {
				on: {},
			},
			deletingAvatar: {
				on: {},
			},
			changeThumbnail: {
				on: {},
			},
		},
		on: {
			CLOSE: {
				target: 'initial',
			},
			SAVE_THUMBNAIL: {
				actions: ['saveThumbnail'],
			},
			DELETE: {
				target: 'deletingAvatar',
				actions: ['deleteAvatar'],
			},
			UPLOAD: {
				target: 'uploadingAvatar',
				actions: ['uploadAvatar'],
			},
			RESET_UPLOAD: {
				cond: 'isUploadedImageEditingCanceled',
				actions: ['resetAfterUploadCancel'],
			},
			UPDATE_INITIAL: {
				actions: ['updateInitialContext'],
				target: 'initial',
			},
		},
	},
	{
		actions: {
			setInitialContext: assign({
				url: context => context.initial.url,
				thumbnailUrl: context => context.initial.thumbnailUrl,
				thumbnail: context => context.initial.thumbnail,
			}),
			saveThumbnail: assign((context, event) => {
				if (event.type !== 'SAVE_THUMBNAIL') return context

				return {
					initial: {
						...context.initial,
						thumbnail: event.payload.thumbnail,
					},
					thumbnailUrl: event.payload.thumbnailUrl,
					thumbnail: event.payload.thumbnail,
					isUploadedImageEdited: true,
				}
			}),
			deleteAvatar: assign(context => ({
				url: '',
				thumbnailUrl: '',
				thumbnail: '',
			})),
			uploadAvatar: assign((context, event) => {
				if (event.type !== 'UPLOAD') return context

				return {
					url: event.url,
					thumbnail: undefined,
					isUploadedImageEdited: false,
				}
			}),
			resetAfterUploadCancel: assign(context => ({
				url: context.initial.url,
				thumbnail: context.initial.thumbnail,
				isUploadedImageEdited: true,
			})),
			// updateInitialContext: assign((context, event) => {
			// 	if (event.type !== 'UPDATE_INITIAL') return context

			// 	return {
			// 		initial: {
			// 			url: event.payload.avatarUrl!,
			// 			thumbnailUrl: event.payload.avatarThumbnailUrl!,
			// 			thumbnail: event.payload.avatarThumbnail!,
			// 		},
			// 	}
			// }),
		},
		guards: {
			isUploadedImageEditingCanceled: context =>
				!context.isUploadedImageEdited,
		},
	}
)

export default avatarMachine
