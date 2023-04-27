import {
	ActionIcon,
	createStyles,
	Flex,
	Header as HeaderMantine,
	MediaQuery,
	Menu,
} from '@mantine/core'
import { useMutation } from '@tanstack/react-query'
import { useUser } from 'entities/user'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { signOut } from 'shared/api'
import { ERoles } from 'shared/types'
import { Icon, useBaseWrapperContext } from 'shared/ui'
import Notifications from './Notifications'

const useStyles = createStyles(theme => ({
	header: {
		backgroundColor: theme.colors.brand[5],
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	dropdown: {
		backgroundColor: theme.colors.brand[1],
	},
	item: {
		color: theme.colors.brand[5],
	},
}))

interface IProps {
	toggleMobileMenu: () => void
	isMobileMenuOpen: boolean
}

const Header = ({ toggleMobileMenu, isMobileMenuOpen }: IProps) => {
	const { classes } = useStyles()
	const { user } = useUser()
	const router = useRouter()
	const { mutate: signOutMutate } = useMutation({
		mutationFn: signOut,
	})
	const { isEdit, setIsEdit } = useBaseWrapperContext()

	function activateEdit() {
		if (typeof window !== 'undefined') {
			window.localStorage.setItem('edit', 'true')
			setIsEdit(true)
		}
	}

	function deactiveEdit() {
		if (typeof window !== 'undefined') {
			window.localStorage.setItem('edit', 'false')
			setIsEdit(false)
		}
	}

	return (
		<HeaderMantine
			className={classes.header}
			height={60}
			px="xl"
			withBorder={false}
		>
			<Image
				src="/logo.svg"
				width={64}
				height={26}
				alt="66bit feedback service"
			/>
			<MediaQuery
				largerThan="sm"
				styles={{
					display: 'none',
				}}
			>
				<ActionIcon
					variant="transparent"
					size="lg"
					sx={theme => ({
						color: 'white',
						background: 'transparent',
						'&:hover': {
							backgroundColor: theme.colors.brand[6],
						},
					})}
					onClick={toggleMobileMenu}
				>
					<Icon icon={isMobileMenuOpen ? 'close' : 'menu'} size={20} />
				</ActionIcon>
			</MediaQuery>
			<MediaQuery
				smallerThan="sm"
				styles={{
					display: 'none',
				}}
			>
				<Flex gap="md" align="center">
					<Notifications />
					<Menu
						position="bottom-end"
						classNames={{
							dropdown: classes.dropdown,
							item: classes.item,
						}}
					>
						<Menu.Target>
							<ActionIcon variant="filled" color="brand" size="lg">
								<Icon icon="account_circle" size={28} />
							</ActionIcon>
						</Menu.Target>
						<Menu.Dropdown>
							<Menu.Item component={Link} href="/profile">
								Профиль
							</Menu.Item>
							{user?.roles.includes(ERoles.admin) ? (
								isEdit ? (
									<Menu.Item onClick={deactiveEdit}>
										Выйти из режима управления
									</Menu.Item>
								) : (
									<Menu.Item onClick={activateEdit}>
										Управление
									</Menu.Item>
								)
							) : null}
							<Menu.Item
								onClick={() => {
									signOutMutate()
									router.push('/')
								}}
							>
								Выйти
							</Menu.Item>
						</Menu.Dropdown>
					</Menu>
				</Flex>
			</MediaQuery>
		</HeaderMantine>
	)
}

export default Header
