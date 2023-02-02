import { MantineProvider } from '@mantine/core'
import { render, RenderOptions } from '@testing-library/react'
import React, { ReactElement } from 'react'
import { mantineTheme } from '../styles/mantineTheme'

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
	return (
		<MantineProvider withGlobalStyles withNormalizeCSS theme={mantineTheme}>
			{children}
		</MantineProvider>
	)
}

const customRender = (
	ui: ReactElement,
	options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
