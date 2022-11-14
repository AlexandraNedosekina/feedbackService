import { createStyles } from '@mantine/core'

export const useStyles = createStyles(theme => ({
	root: {
		backgroundColor: theme.colors.brand[0],
		borderRadius: '4px',
		padding: theme.spacing.lg,
	},
}))
