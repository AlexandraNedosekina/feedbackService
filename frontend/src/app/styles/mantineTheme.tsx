import {
	BadgeProps,
	ButtonProps,
	ButtonStylesParams,
	MantineThemeOverride,
	rem,
	ScrollAreaProps,
	SelectProps,
} from '@mantine/core'
import { Icon } from 'shared/ui'

const ButtonDefaultProps: Partial<ButtonProps> = {}
const BadgeDefaultProps: Partial<BadgeProps> = {
	radius: 'sm',
	size: 'xl',
}
const SelectDefaultProps: Partial<SelectProps> = {
	rightSection: <Icon icon="expand_more" />,
}
const ScrollAreaDefaultProps: Partial<ScrollAreaProps> = {
	scrollbarSize: 9,
	type: 'scroll',
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
				fontSize: rem(32),
			},
			h2: {
				fontSize: rem(24),
			},
			h3: {
				fontSize: rem(19),
			},
			h4: {
				fontSize: rem(16),
			},
			h5: {
				fontSize: rem(14),
			},
			h6: {
				fontSize: rem(13),
			},
		},
	},
	components: {
		Button: {
			defaultProps: ButtonDefaultProps,
			styles: (theme, params: ButtonStylesParams, { variant }) => ({
				root: {
					borderRadius: '4px',
					boxShadow:
						variant === 'filled'
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
			variants: {
				filled: (theme, params) => ({
					root: {
						boxShadow: `inset 0px -2px 0px ${
							theme.colors[params.color ?? 'brand'][
								+theme.primaryShade + 2
							]
						}`,
					},
				}),
			},
		},
		Badge: {
			defaultProps: BadgeDefaultProps,
			styles: () => ({
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
		Input: {
			styles: theme => ({
				input: {
					border: `1px solid ${theme.colors.brand[5]}`,
					borderRadius: '4px',
					['::placeholder']: {
						color: theme.colors.brand[3],
					},
				},
				icon: {
					color: theme.colors.brand[5],
				},
			}),
		},
		InputWrapper: {
			styles: () => ({
				label: {
					fontFamily: 'Montserrat, sans-serif',
					fontWeight: 700,
				},
			}),
		},
		ScrollArea: {
			defaultProps: ScrollAreaDefaultProps,
		},
		Text: {
			styles: () => ({
				root: {
					wordBreak: 'break-word',
				},
			}),
		},
	},
}
