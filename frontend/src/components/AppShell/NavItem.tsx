import Icon, { IconProps, Icons } from '@components/Icon'
import { ActionIcon, ActionIconProps, Button, ButtonProps } from '@mantine/core'
import Link from 'next/link'
import { FC } from 'react'

interface Props {
	icon: Icons
	href: string
	active?: boolean
	text?: string
	isFull?: boolean
	iconProps?: Partial<IconProps>
	closeMenu?: () => void
}

const NavItem: FC<Props> = ({
	icon,
	href,
	active,
	isFull,
	text,
	iconProps,
	closeMenu,
}) => {
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

	return (
		<Link href={href} passHref>
			{isFull ? (
				<Button component="a" {...buttonProps} onClick={closeMenu}>
					{text}
				</Button>
			) : (
				<ActionIcon component="a" {...actionIconProps} onClick={closeMenu}>
					<Icon icon={icon} size={24} {...iconProps} />
				</ActionIcon>
			)}
		</Link>
	)
}

export default NavItem
