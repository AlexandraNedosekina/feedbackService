import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { mantineTheme } from '../styles/mantineTheme'

export const withMantine =
	<T extends JSX.IntrinsicAttributes>(Component: React.FC<T>) =>
	(props: T) =>
		(
			<MantineProvider
				withCSSVariables
				withGlobalStyles
				withNormalizeCSS
				theme={mantineTheme}
			>
				<Notifications />
				<Component {...props} />
			</MantineProvider>
		)
