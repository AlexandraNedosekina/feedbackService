import { showNotification } from '@mantine/notifications'
import { QueryClient } from '@tanstack/react-query'

function displayErrorNotification(error: Error) {
	showNotification({
		title: 'Ошибка',
		message: error.message,
		color: 'red',
	})
}

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			onError: error => {
				if (error instanceof Error) {
					displayErrorNotification(error)
				}
			},
		},
		mutations: {
			onError: error => {
				if (error instanceof Error) {
					displayErrorNotification(error)
				}
			},
		},
	},
})
