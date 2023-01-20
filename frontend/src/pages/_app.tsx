import { MantineProvider } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'
import { QueryClientProvider } from '@tanstack/react-query'
import 'dayjs/locale/ru'
import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { ReactElement, ReactNode } from 'react'
import { queryClient } from 'src/api'
import '../styles/global.css'
import { mantineTheme } from '../styles/mantineTheme'
import '@fullcalendar/common/main.css'
import '@fullcalendar/daygrid/main.css'
import '@fullcalendar/timegrid/main.css'

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
