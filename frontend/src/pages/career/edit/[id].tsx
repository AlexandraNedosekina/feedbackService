import { EditCareer } from '@components/AdminCareer/components'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { BaseLayout } from 'src/layouts'
import { NextPageWithLayout } from 'src/pages/_app'
import { ERoles } from 'src/types/roles'
import { useBaseLayoutContext } from 'src/utils/useBaseLayoutContext'
import { useUser } from 'src/utils/useUser'

const EditCareerPage: NextPageWithLayout = () => {
	const { user } = useUser()
	const { isEdit } = useBaseLayoutContext()
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
				<title>Редактирование карьерного роста</title>
			</Head>

			<EditCareer />
		</>
	)
}

EditCareerPage.getLayout = function getLayout(page) {
	return <BaseLayout>{page}</BaseLayout>
}

export default EditCareerPage
