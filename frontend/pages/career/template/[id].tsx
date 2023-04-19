import { useUser } from 'entities/user'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { AdminCareerTemplateEditPage } from 'pages/admin-career-template-edit'
import { useEffect } from 'react'
import { ERoles } from 'shared/types'
import { BaseWrapper, useBaseWrapperContext } from 'shared/ui'
import { AppShell } from 'widgets/app-shell'
import { NextPageWithLayout } from '../../_app'

const Page: NextPageWithLayout = () => {
	const { user } = useUser()
	const { isEdit } = useBaseWrapperContext()
	const router = useRouter()

	useEffect(() => {
		if (!user?.roles.includes(ERoles.admin) || !isEdit) {
			router.push('/career')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isEdit])

	return (
		<>
			<Head>
				<title>Редактирование шаблона карьерного роста</title>
			</Head>

			<AdminCareerTemplateEditPage />
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
