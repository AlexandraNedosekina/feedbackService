import { Grid, Stack } from '@mantine/core'
import Head from 'next/head'
import { BaseLayout } from 'src/layouts'
import { NextPageWithLayout } from './_app'
import dynamic from 'next/dynamic'
import SelectWorker from '@components/FullCalendar/components/SelectWorker'
import DateInput from '@components/FullCalendar/components/DateInput'
import styles from '../styles/calendar.module.sass'

const FullCalendar = dynamic(() => import('../components/FullCalendar'), {
	ssr: false,
})

const CommunicationPage: NextPageWithLayout = () => {
	return (
		<>
			<Head>
				<title>Календарь встреч</title>
			</Head>
			<div className={styles.wrapper}>
				<Grid columns={4} mt="md">
					<Grid.Col span={1} h={'100%'} py={0}>
						<Stack spacing='md'>
							<SelectWorker />
							<DateInput />
						</Stack>
					</Grid.Col>
					<Grid.Col span={3} h={'100%'} py={0}>
						<FullCalendar />
					</Grid.Col>
				</Grid>
			</div>
		</>
	)
}

CommunicationPage.getLayout = function getLayout(page) {
	return <BaseLayout>{page}</BaseLayout>
}

export default CommunicationPage
