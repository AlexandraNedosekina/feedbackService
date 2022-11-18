import Icon from '@components/Icon'
import {
	ActionIcon,
	createStyles,
	Header as HeaderMantine,
	Menu,
	MediaQuery,
} from '@mantine/core'
import { useMutation } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { signOut } from 'src/api'

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

interface Props {
	openMenu: () => void
	isOpen: boolean
}

const Header: FC<Props> = ({ openMenu, isOpen }) => {
	const { classes } = useStyles()

	const router = useRouter()

	const { mutate: signOutMutate } = useMutation({
		mutationFn: signOut,
	})

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
					onClick={openMenu}
				>
					<Icon icon={isOpen ? 'close' : 'menu'} size={20} />
				</ActionIcon>
			</MediaQuery>
			<MediaQuery
				smallerThan="sm"
				styles={{
					display: 'none',
				}}
			>
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
			</MediaQuery>
		</HeaderMantine>
	)
}

export default Header
