import { Icon, IIconProps, TIcons } from 'shared/ui'
import { ActionIcon, ActionIconProps, Button, ButtonProps } from '@mantine/core'
import Link from 'next/link'

interface IProps {
	icon: TIcons
	href: string
	active?: boolean
	text?: string
	isFull?: boolean
	iconProps?: Partial<IIconProps>
	closeMenu?: () => void
}

const NavItem = ({
	icon,
	href,
	active,
	isFull,
	text,
	iconProps,
	closeMenu,
}: IProps) => {
	const actionIconProps: ActionIconProps = {
		variant: 'transparent',
		size: 'lg',
		sx: theme => ({
			color: 'white',
			background: active ? theme.colors.brand[5] : 'transparent',
			'&:hover': {
				backgroundColor: theme.colors.brand[6],
			},
		}),
	}

	const buttonProps: ButtonProps = {
		leftIcon: <Icon icon={icon} size={20} {...iconProps} />,
		variant: 'filled',
		sx: theme => ({
			backgroundColor: active ? theme.colors.brand[5] : 'transparent',
			border: 'none',
		}),
		styles: () => ({
			inner: {
				justifyContent: 'flex-start',
			},
		}),
	}

	if (isFull) {
		return (
			<Button
				component={Link}
				href={href}
				{...buttonProps}
				onClick={closeMenu}
			>
				{text}
			</Button>
		)
	}

	return (
		<ActionIcon
			component={Link}
			href={href}
			{...actionIconProps}
			onClick={closeMenu}
		>
			<Icon icon={icon} size={24} {...iconProps} />
		</ActionIcon>
	)
}

export default NavItem
