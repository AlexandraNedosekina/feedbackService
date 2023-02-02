import { AppShell } from '@mantine/core'
import { ReactNode, useState } from 'react'
import Header from './Header'
import Navbar from './Navbar'

interface IProps {
	children: ReactNode
}

export default ({ children }: IProps) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	return (
		<AppShell
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
			padding={0}
		>
			{children}
		</AppShell>
	)
}
