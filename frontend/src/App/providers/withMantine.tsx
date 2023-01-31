import { MantineProvider } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'
import { mantineTheme } from '../styles/mantineTheme'

export const withMantine = (Component: React.FC) => (props: any) =>
	(
		<MantineProvider
			withCSSVariables
			withGlobalStyles
			withNormalizeCSS
			theme={mantineTheme}
		>
			<NotificationsProvider>
				<Component {...props} />
			</NotificationsProvider>
		</MantineProvider>
	)
