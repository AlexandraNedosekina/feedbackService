import { ActionIcon } from '@mantine/core'
import { ComponentMeta, ComponentStory } from '@storybook/react'
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
} as ComponentMeta<typeof Icon>

const Template: ComponentStory<typeof Icon> = args => <Icon {...args} />

export const Default = Template.bind({})

export const Action = Template.bind({})
Action.args = {
	size: 24,
}
Action.decorators = [
	Story => (
		<ActionIcon variant="filled" color="brand" size="lg">
			<Story />
		</ActionIcon>
	),
]
