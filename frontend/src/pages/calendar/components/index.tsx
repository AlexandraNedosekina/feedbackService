import { Container } from '@mantine/core'
import dynamic from 'next/dynamic'
import styles from './styles.module.sass'

const FullCalendar = dynamic(() => import('widgets/fullcalendar'), {
	ssr: false,
})

export default () => {
	return (
		<Container size="xl" py="lg">
			{/* <Grid columns={4} mt="md"> */}
			{/* <Grid.Col span={1} h={'100%'} py={0}>
						<Stack spacing='md'>
							<SelectWorker />
							<DateInput />
						</Stack>
					</Grid.Col> */}
			{/* <Grid.Col span={3} h={'100%'} py={0}> */}
			<FullCalendar />
			{/* </Grid.Col> */}
			{/* </Grid> */}
		</Container>
	)
}
