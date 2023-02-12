import { ActionIcon } from '@mantine/core'
import { Meta, StoryObj } from '@storybook/react'
import Icon from './Icon'

export default {
	title: 'Shared/Icon',
	component: Icon,
	args: {
		icon: 'home',
		size: 80,
		filled: false,
		type: 'outlined',
		weight: 300,
	},
	argTypes: {
		weight: {
			control: {
				type: 'range',
				min: 100,
				max: 700,
				step: 100,
			},
		},
	},
} as Meta<typeof Icon>

export const Default = {}

export const Action: StoryObj<typeof Icon> = {
	args: {
		size: 24,
	},
	decorators: [
		StoryFn => (
			<ActionIcon variant="filled" color="brand" size="lg">
				<StoryFn />
			</ActionIcon>
		),
	],
}
