import AppShell from '@components/AppShell'
import { LoadingOverlay } from '@mantine/core'
import { getCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'

const BaseLayout = ({ children }: { children: ReactNode }) => {
	const router = useRouter()
	const cookie = getCookie('refresh-token')
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		if (!cookie) {
			router.push('/')
		}

		setIsLoading(false)
	}, [cookie, router])

	if (isLoading || !cookie) {
		return (
			<div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
				<LoadingOverlay visible={true} />
			</div>
		)
	}

	return <AppShell>{children}</AppShell>
}

export default BaseLayout
