import { MantineTheme, ModalBaseStylesNames, Styles } from '@mantine/core'

export const modalResetOverflow: (
	theme: MantineTheme
) => Styles<ModalBaseStylesNames, never> = theme => ({
	header: { borderRadius: theme.spacing.xs },
	inner: {
		'> section': {
			overflowY: 'visible',
		},
		'.mantine-ScrollArea-root': {
			overflow: 'visible',
		},
	},
})
