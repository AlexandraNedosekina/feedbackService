import Icon from '@components/Icon'
import {
	BadgeProps,
	BadgeStylesParams,
	ButtonProps,
	ButtonStylesParams,
	MantineThemeOverride,
	SelectProps,
} from '@mantine/core'

const ButtonDefaultProps: Partial<ButtonProps> = {}
const BadgeDefaultProps: Partial<BadgeProps> = {
	radius: 'sm',
	size: 'xl',
}
const SelectDefaultProps: Partial<SelectProps> = {
	rightSection: <Icon icon="expand_more" />,
}

export const mantineTheme: MantineThemeOverride = {
	colors: {
		brand: [
			'#F2F5F9',
			'#E5EBF3',
			'#C9D5E7',
			'#A7BEDA',
			'#7DA2CD',
			'#3B82BF',
			'#3474AA',
			'#2D6493',
			'#255278',
			'#1A3A55',
		],
	},
	primaryColor: 'brand',
	primaryShade: 5,
	fontFamily: 'Rubik, sans-serif',
	headings: {
		fontFamily: 'Montserrat, sans-serif',
		fontWeight: 700,
		sizes: {
			h1: {
				fontSize: 32,
			},
			h2: {
				fontSize: 24,
			},
			h3: {
				fontSize: 19,
			},
			h4: {
				fontSize: 16,
			},
			h5: {
				fontSize: 14,
			},
			h6: {
				fontSize: 13,
			},
		},
	},
	components: {
		Button: {
			defaultProps: ButtonDefaultProps,
			styles: (theme, params: ButtonStylesParams) => ({
				root: {
					borderRadius: '4px',
					boxShadow:
						params.variant === 'filled'
							? `inset 0px -2px 0px ${
									theme.colors[params.color ?? 'brand'][
										+theme.primaryShade + 2
									]
							  }`
							: undefined,
					fontWeight: 400,
					'&:disabled': {
						backgroundColor: theme.colors.brand[3],
						color: 'white',
						boxShadow: `inset 0px -2px 0px ${theme.colors.brand[4]}`,
					},
				},
			}),
		},
		Badge: {
			defaultProps: BadgeDefaultProps,
			styles: (theme, params: BadgeStylesParams) => ({
				root: {
					fontWeight: 'normal',
					textTransform: 'none',
				},
			}),
		},
		Select: {
			defaultProps: SelectDefaultProps,
			styles: theme => ({
				input: {
					border: `1px solid ${theme.colors.brand[5]}`,
					color: theme.colors.brand[5],
				},
				rightSection: {
					color: theme.colors.brand[5],
					pointerEvents: 'none',
				},
			}),
		},
		TimeRangeInput: {
			styles: theme => ({
				input: {
					border: `1px solid ${theme.colors.brand[5]}`,
				},
			}),
		},
	},
}
