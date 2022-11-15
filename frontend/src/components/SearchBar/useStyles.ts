import { createStyles } from '@mantine/core'

export const useStyles = createStyles(theme => ({
	dropdown: {
		backgroundColor: theme.colors.brand[1],
		borderColor: theme.colors.brand[5],
		borderRadius: '4px',
		paddingBlock: theme.spacing.sm,
		paddingInline: theme.spacing.lg,
	},
	arrow: {
		border: `1px solid ${theme.colors.brand[5]}`,
	},
}))
