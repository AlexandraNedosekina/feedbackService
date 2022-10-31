import Icon, { Icons } from '@components/Icon'
import {
	ActionIcon,
	Box,
	MediaQuery,
	Navbar as NavbarMantine,
	Stack,
	UnstyledButton,
} from '@mantine/core'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import NavItem from './NavItem'

const navItems: { icon: Icons; href: string; text: string }[] = [
	{
		icon: 'home',
		href: '/',
		text: 'Главная',
	},
	{
		icon: 'star',
		href: '/feedback',
		text: 'Оценки',
	},
	{
		icon: 'trending_up',
		href: '/career',
		text: 'Карьерный рост',
	},
	{
		icon: 'calendar_month',
		href: '/calendar',
		text: 'Календарь встреч',
	},
]

interface Props {
	isOpen: boolean
	closeMenu: () => void
}

const Navbar: FC<Props> = ({ isOpen, closeMenu }) => {
	const router = useRouter()

	const [isFull, setIsFull] = useState<boolean>(false)

	const toggleFull = () => {
		setIsFull(!isFull)

		if (typeof window !== 'undefined') {
			window.localStorage.setItem('isFull', JSON.stringify(!isFull))
		}
	}

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const isFullLocalStorage = window.localStorage.getItem('isFull')

			if (typeof isFullLocalStorage === 'string') {
				setIsFull(!!JSON.parse(isFullLocalStorage))
			} else {
				window.localStorage.setItem('isFull', JSON.stringify(isFull))
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<NavbarMantine
			width={{ sm: isFull ? 270 : 60 }}
			sx={theme => ({
				backgroundColor: theme.colors.brand[7],
			})}
			withBorder={false}
			px="lg"
			hiddenBreakpoint="sm"
			hidden={!isOpen}
		>
			<Stack
				justify="space-between"
				align="center"
				py="xl"
				sx={() => ({ height: '100%' })}
			>
				<Stack
					sx={theme => ({
						[`@media (max-width: ${theme.breakpoints.sm}px)`]: {
							width: '100%',
						},
					})}
				>
					<Box
						sx={theme => ({
							display: 'none',
							[`@media (max-width: ${theme.breakpoints.sm}px)`]: {
								display: 'block',
							},
						})}
					>
						<NavItem
							icon={'account_circle'}
							href="/profile"
							text="Профиль"
							isFull={true}
							active={router.pathname === '/profile'}
							closeMenu={closeMenu}
						/>
					</Box>
					{navItems.map((item, i) => (
						<NavItem
							key={i}
							icon={item.icon}
							href={item.href}
							text={item.text}
							isFull={isFull}
							iconProps={
								item.icon === 'star'
									? {
											filled: true,
									  }
									: undefined
							}
							active={router.pathname === item.href}
							closeMenu={closeMenu}
						/>
					))}
					<MediaQuery largerThan="sm" styles={{ display: 'none' }}>
						<UnstyledButton
							sx={theme => ({
								color: 'white',
								fontSize: theme.fontSizes.sm,
							})}
							ml="sm"
							onClick={() => {
								router.push('/login')
							}}
						>
							Выйти
						</UnstyledButton>
					</MediaQuery>
				</Stack>

				<Box
					sx={() => ({
						width: '100%',
						display: 'flex',
						justifyContent: isFull ? 'flex-end' : 'center',
					})}
				>
					<ActionIcon
						onClick={toggleFull}
						variant="transparent"
						sx={theme => ({
							color: 'white',
							transform: isFull ? 'rotate(180deg)' : 'rotate(0deg)',
							'&:hover': {
								backgroundColor: theme.colors.brand[6],
							},
						})}
					>
						<Icon icon="double_arrow" />
					</ActionIcon>
				</Box>
			</Stack>
		</NavbarMantine>
	)
}

export default Navbar
