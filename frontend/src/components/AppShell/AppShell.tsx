import { AppShell as AppShellMantine } from '@mantine/core'
import { FC, ReactNode, useState } from 'react'
import Header from './Header'
import Navbar from './Navbar'

interface Props {
	children: ReactNode
}

const AppShell: FC<Props> = ({ children }) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	return (
		<AppShellMantine
			navbar={
				<Navbar
					isOpen={isMenuOpen}
					closeMenu={() => setIsMenuOpen(false)}
				/>
			}
			header={
				<Header
					isOpen={isMenuOpen}
					openMenu={() => setIsMenuOpen(state => !state)}
				/>
			}
		>
			{children}
		</AppShellMantine>
	)
}

export default AppShell
