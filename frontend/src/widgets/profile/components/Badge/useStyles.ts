import { createStyles, getStylesRef } from '@mantine/core'

export const useStyles = createStyles(theme => ({
	badge: {
		position: 'relative',
		overflow: 'visible',
		'&:hover': {
			[`.${getStylesRef('badgeActionsCommon')}`]: {
				opacity: 1,
			},
		},
	},
	badgeActionsCommon: {
		ref: getStylesRef('badgeActionsCommon'),
		position: 'absolute',
		opacity: 0,
		top: 0,
		borderRadius: '50%',
		backgroundColor: theme.colors.brand[0],
		transition: 'opacity 0.2s ease',
	},
	deleteBadge: {
		right: 0,
		transform: 'translate(50%, -50%)',
		'&:focus': {
			transform: 'translate(50%, -50%)',
		},
	},
	updateBadge: {
		left: 0,
		transform: 'translate(-50%, -50%)',
		'&:focus': {
			transform: 'translate(-50%, -50%)',
		},
	},
}))
