import { MantineProvider } from '@mantine/core'
import { DatesProvider } from '@mantine/dates'
import { Notifications } from '@mantine/notifications'
import { mantineTheme } from '../styles/mantineTheme'
import 'dayjs/locale/ru'

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
				<DatesProvider settings={{ locale: 'ru' }}>
					<Notifications zIndex={1000} />
					<Component {...props} />
				</DatesProvider>
			</MantineProvider>
		)
