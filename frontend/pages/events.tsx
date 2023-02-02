import { useUser } from 'entities/user'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { EventsPage } from 'pages/events'
import { useEffect } from 'react'
import { BaseWrapper, useBaseWrapperContext } from 'shared/ui'
import { ERoles } from 'shared/types'
import { AppShell } from 'widgets/app-shell'
import { NextPageWithLayout } from './_app'

const Page: NextPageWithLayout = () => {
	const router = useRouter()
	const { user } = useUser()
	const { isEdit } = useBaseWrapperContext()

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const edit = window.localStorage.getItem('edit')
			if (edit === 'false' || edit === null) {
				router.push('/profile')
			}
		}

		if (!user?.roles.includes(ERoles.admin)) {
			router.push('/profile')
		}
	}, [router, user?.roles, isEdit])

	return (
		<>
			<Head>
				<title>Создание сбора обратной связи</title>
			</Head>

			<EventsPage />
		</>
	)
}

Page.getLayout = function getLayout(page) {
	return (
		<BaseWrapper>
			<AppShell>{page}</AppShell>
		</BaseWrapper>
	)
}

export default Page
