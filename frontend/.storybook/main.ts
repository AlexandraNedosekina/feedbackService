import { StorybookConfig } from '@storybook/nextjs'

const config: StorybookConfig = {
	core: {
		builder: '@storybook/builder-webpack5',
	},
	stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
	],
	staticDirs: ['../public'],
	framework: {
		name: '@storybook/nextjs',
		options: {},
	},
}

export default config
