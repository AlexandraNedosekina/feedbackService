import { AdminEvents } from '@components/AdminEvents'
import { Container, Title } from '@mantine/core'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { BaseLayout } from 'src/layouts'
import { ERoles } from 'src/types/roles'
import { useBaseLayoutContext } from 'src/utils/useBaseLayoutContext'
import { useUser } from 'src/utils/useUser'
import { NextPageWithLayout } from './_app'

const EventsPage: NextPageWithLayout = () => {
	const router = useRouter()
	const { user } = useUser()
	const { isEdit } = useBaseLayoutContext()

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

			<Container mt="lg">
				<Title order={2}>Сбор обратной связи</Title>

				<AdminEvents />
			</Container>
		</>
	)
}

EventsPage.getLayout = function getLayout(page) {
	return <BaseLayout>{page}</BaseLayout>
}

export default EventsPage
