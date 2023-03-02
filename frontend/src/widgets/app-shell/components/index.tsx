import { AppShell } from '@mantine/core'
import { ReactNode, useState } from 'react'
import Header from './Header'
import Navbar from './Navbar'

interface IProps {
	children: ReactNode
}

export default ({ children }: IProps) => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

	return (
		<AppShell
			navbar={
				<Navbar
					isMobileMenuOpen={isMobileMenuOpen}
					closeMobileMenu={() => setIsMobileMenuOpen(false)}
				/>
			}
			header={
				<Header
					isMobileMenuOpen={isMobileMenuOpen}
					toggleMobileMenu={() => setIsMobileMenuOpen(state => !state)}
				/>
			}
			padding={0}
		>
			{children}
		</AppShell>
	)
}
