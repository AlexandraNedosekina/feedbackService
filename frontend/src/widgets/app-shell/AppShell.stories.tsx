import { Meta, StoryObj } from '@storybook/react'
import { BaseWrapperContext } from 'shared/ui'
import { AppShell } from '.'
import { rest } from 'msw'
import { baseURL } from 'shared/api'

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
	parameters: {
		msw: {
			handlers: [
				rest.get(`${baseURL}/user/me`, (req, res, ctx) => {
					return res(ctx.delay())
				}),
				rest.get(`${baseURL}/auth/signout`, (req, res, ctx) => {
					return res(ctx.delay())
				}),
			],
		},
	},
}
