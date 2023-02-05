import { Meta, StoryObj } from '@storybook/react'
import { BaseWrapperContext } from 'shared/ui'
import { AppShell } from '.'

export default {
	title: 'Widgets/AppShell',
	component: AppShell,
} as Meta<typeof AppShell>

export const Default: StoryObj<typeof AppShell> = {
	decorators: [
		StoryFn => (
			<BaseWrapperContext.Provider
				value={{
					isEdit: false,
					setIsEdit: () => {},
				}}
			>
				<StoryFn />
			</BaseWrapperContext.Provider>
		),
	],
}
