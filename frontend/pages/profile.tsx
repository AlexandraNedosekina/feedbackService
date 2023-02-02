import { ProfilePage } from 'pages/profile'
import { BaseWrapper } from 'shared/ui'
import { AppShell } from 'widgets/app-shell'
import { NextPageWithLayout } from './_app'

const Page: NextPageWithLayout = () => {
	return <ProfilePage />
}

Page.getLayout = function getLayout(page) {
	return (
		<BaseWrapper>
			<AppShell>{page}</AppShell>
		</BaseWrapper>
	)
}

export default Page
