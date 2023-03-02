import { Icon, IIconProps, TIcons } from 'shared/ui'
import { ActionIcon, ActionIconProps, Button, ButtonProps } from '@mantine/core'
import Link from 'next/link'
import { useNavbarContext } from '../utils'

interface IProps {
	icon: TIcons
	href: string
	active?: boolean
	text?: string
	iconProps?: Partial<IIconProps>
	notify?: boolean
}

const NavItem = ({ icon, href, active, text, iconProps, notify }: IProps) => {
	const {
		closeMobileMenu,
		isFull: isFullContext,
		isMobile,
	} = useNavbarContext()
	const isFull = isMobile ? true : isFullContext

	const actionIconProps: ActionIconProps = {
		variant: 'transparent',
		size: 'lg',
		sx: theme => ({
			color: 'white',
			background: active ? theme.colors.brand[5] : 'transparent',
			position: 'relative',
			'&:hover': {
				backgroundColor: theme.colors.brand[6],
			},
			'&::before': {
				content: '""',
				display: notify ? 'block' : 'none',
				position: 'absolute',
				width: '12px',
				height: '12px',
				backgroundColor: theme.colors.red[6],
				borderRadius: '50%',
				right: 0,
				top: 0,
				transform: 'translate(50%, -50%)',
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
				onClick={closeMobileMenu}
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
			onClick={closeMobileMenu}
		>
			<Icon icon={icon} size={24} {...iconProps} />
		</ActionIcon>
	)
}

export default NavItem
