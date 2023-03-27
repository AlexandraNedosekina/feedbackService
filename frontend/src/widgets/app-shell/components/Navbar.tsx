import {
	ActionIcon,
	Box,
	MediaQuery,
	Navbar as NavbarMantine,
	Stack,
	Text,
	UnstyledButton,
	useMantineTheme,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { signOut } from 'shared/api'
import { Icon, useBaseWrapperContext } from 'shared/ui'
import { ERoles } from 'shared/types'
import { useUser } from 'entities/user'
import NavItem from 'widgets/app-shell/components/NavItem'
import { NavbarContext } from '../utils'
import NavItemMapper from './NavItemMapper'

interface IProps {
	isMobileMenuOpen: boolean
	closeMobileMenu: () => void
}

const Navbar = ({ isMobileMenuOpen, closeMobileMenu }: IProps) => {
	const router = useRouter()
	const { isEdit, setIsEdit } = useBaseWrapperContext()
	const { user } = useUser()
	const [isFull, setIsFull] = useState<boolean>(false)

	const theme = useMantineTheme()
	const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)

	const toggleFull = () => {
		setIsFull(!isFull)

		if (typeof window !== 'undefined') {
			window.localStorage.setItem('isFull', JSON.stringify(!isFull))
		}
	}

	const { mutate: signOutMutate } = useMutation({
		mutationFn: signOut,
	})

	function activateEdit() {
		if (typeof window !== 'undefined') {
			window.localStorage.setItem('edit', 'true')
			setIsEdit(true)
		}
	}

	function deactivateEdit() {
		if (typeof window !== 'undefined') {
			window.localStorage.setItem('edit', 'false')
			setIsEdit(false)
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
		<NavbarContext.Provider
			value={{
				isFull,
				closeMobileMenu,
				isMobile,
			}}
		>
			<NavbarMantine
				width={{ sm: isFull ? 270 : 60 }}
				sx={theme => ({
					backgroundColor: theme.colors.brand[7],
				})}
				withBorder={false}
				px="lg"
				hiddenBreakpoint="sm"
				hidden={!isMobileMenuOpen}
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
									a: {
										width: '100%',
									},
								},
							})}
						>
							<NavItem
								icon={'account_circle'}
								href="/profile"
								text="Профиль"
								active={router.pathname === '/profile'}
							/>
						</Box>
						{isEdit && user?.roles.includes(ERoles.admin) && (
							<NavItem
								icon={'home'}
								href={'/events'}
								text={'Сбор обратной связи'}
								active={router.pathname.split('/')[1] === 'events'}
							/>
						)}

						<NavItemMapper name="feedback" />
						<NavItemMapper name="career" />
						<NavItemMapper name="calendar" />

						<MediaQuery largerThan="sm" styles={{ display: 'none' }}>
							<Box>
								{user?.roles.includes(ERoles.admin) ? (
									isEdit ? (
										<Text
											onClick={deactivateEdit}
											ml="sm"
											color="white"
										>
											Выйти из режима управления
										</Text>
									) : (
										<Text
											onClick={activateEdit}
											ml="sm"
											color="white"
										>
											Управление
										</Text>
									)
								) : null}
								<UnstyledButton
									sx={theme => ({
										color: 'white',
										fontSize: theme.fontSizes.sm,
									})}
									ml="sm"
									onClick={() => {
										signOutMutate()
										router.push('/')
									}}
								>
									Выйти
								</UnstyledButton>
							</Box>
						</MediaQuery>
					</Stack>

					<Box
						sx={() => ({
							width: '100%',
							display: isMobile ? 'none' : 'flex',
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
		</NavbarContext.Provider>
	)
}

export default Navbar
