import { Chip, createStyles } from '@mantine/core'

const useStyles = createStyles(theme => ({
	label: {
		paddingInline: theme.spacing.lg,
		borderRadius: '4px',
		color: theme.colors.brand[5],
		'&[data-checked]': {
			'&, &:hover': {
				backgroundColor: theme.colors.brand[0],
				borderColor: theme.colors.brand[5],
			},
			paddingInline: theme.spacing.lg,
		},
	},
	iconWrapper: {
		display: 'none',
	},
}))

const CareerChips = () => {
	const { classes } = useStyles()

	return (
		<Chip.Group defaultValue={'react'} mt="lg">
			<Chip classNames={classes} value="react" size="lg">
				React
			</Chip>
			<Chip classNames={classes} value="ng" size="lg">
				Angular
			</Chip>
			<Chip classNames={classes} value="vue" size="lg">
				Vue
			</Chip>
			<Chip classNames={classes} value="svelte" size="lg">
				Svelte
			</Chip>
		</Chip.Group>
	)
}

export default CareerChips
