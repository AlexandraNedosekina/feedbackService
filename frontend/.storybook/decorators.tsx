import { MantineProvider } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'
import { Decorator } from '@storybook/react'
import { QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { mantineTheme } from '../src/App/styles/mantineTheme'
import { queryClient } from '../src/App/providers'

const withMantine: Decorator = StoryFn => {
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

const withQueryClient: Decorator = StoryFn => {
	return (
		<QueryClientProvider client={queryClient}>
			<StoryFn />
		</QueryClientProvider>
	)
}

export const globalDecorators = [withMantine, withQueryClient]
