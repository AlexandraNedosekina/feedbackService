import { EditCareer } from '@components/AdminCareer/components'
import Head from 'next/head'
import { BaseLayout } from 'src/layouts'
import { NextPageWithLayout } from 'src/pages/_app'

const EditCareerPage: NextPageWithLayout = () => {
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
