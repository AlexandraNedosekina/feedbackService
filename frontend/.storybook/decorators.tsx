import { MantineProvider } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'
import { DecoratorFn } from '@storybook/react'
import React from 'react'
import { mantineTheme } from '../src/App/styles/mantineTheme'

const withMantine: DecoratorFn = StoryFn => {
	return (
		<MantineProvider
			withCSSVariables
			withGlobalStyles
			withNormalizeCSS
			theme={mantineTheme}
		>
			<NotificationsProvider>
				<StoryFn />
			</NotificationsProvider>
		</MantineProvider>
	)
}

export const globalDecorators = [withMantine]
