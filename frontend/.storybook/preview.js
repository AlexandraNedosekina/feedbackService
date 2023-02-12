import { initialize } from 'msw-storybook-addon'
import { globalDecorators } from './decorators'
import '../src/app/styles/global.css'

initialize()

export const parameters = {
	actions: { argTypesRegex: '^on[A-Z].*' },
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
}

export const decorators = globalDecorators
