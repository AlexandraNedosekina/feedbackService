import AppShell from '@components/AppShell'
import { ReactNode } from 'react'

const BaseLayout = ({ children }: { children: ReactNode }) => {
	return <AppShell>{children}</AppShell>
}

export default BaseLayout
