import { MantineProvider } from '@mantine/core'
import { NotificationsProvider, showNotification } from '@mantine/notifications'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import 'dayjs/locale/ru'
import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { ReactElement, ReactNode } from 'react'
import '../styles/global.css'
import { mantineTheme } from '../styles/mantineTheme'
import '@fullcalendar/common/main.css'
import '@fullcalendar/daygrid/main.css'
import '@fullcalendar/timegrid/main.css'

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

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
	getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
	const getLayout = Component.getLayout ?? (page => page)

	return (
		<QueryClientProvider client={queryClient}>
			<MantineProvider
				withCSSVariables
				withGlobalStyles
				withNormalizeCSS
				theme={mantineTheme}
			>
				<NotificationsProvider>
					{getLayout(<Component {...pageProps} />)}
				</NotificationsProvider>
			</MantineProvider>
		</QueryClientProvider>
	)
}

export default MyApp
