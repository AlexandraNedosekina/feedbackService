import { showNotification } from '@mantine/notifications'
import { QueryClient } from '@tanstack/react-query'
import { QueryClientProvider } from '@tanstack/react-query'

function displayErrorNotification(error: Error) {
	showNotification({
		title: 'Ошибка',
		message: error.message,
		color: 'red',
	})
}

const queryClient = new QueryClient({
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

export const withQueryClient = (Component: React.FC) => (props: any) =>
	(
		<QueryClientProvider client={queryClient}>
			<Component {...props} />
		</QueryClientProvider>
	)
