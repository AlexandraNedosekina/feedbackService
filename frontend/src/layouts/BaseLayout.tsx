import AppShell from '@components/AppShell'
import { getCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import { ReactNode, useEffect } from 'react'

const BaseLayout = ({ children }: { children: ReactNode }) => {
	const router = useRouter()
	const cookie = getCookie('refresh-token')

	useEffect(() => {
		if (!cookie) {
			router.push('/')
		}
	}, [cookie, router])

	return <AppShell>{children}</AppShell>
}

export default BaseLayout
