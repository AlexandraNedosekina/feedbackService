import {
	Container,
	Timeline,
	Title,
	Text,
	Stack,
	Button,
	List,
} from '@mantine/core'
import Head from 'next/head'
import { BaseLayout } from 'src/layouts'
import { NextPageWithLayout } from './_app'
import styles from 'src/styles/main.module.scss'

const CareerPage: NextPageWithLayout = () => {
	return (
		<>
			<Container>
				<Head>
					<title>Карьерный рост</title>
				</Head>
				<Stack spacing={'xl'}>
					<Title>Карьерный рост</Title>
					<Text color="brand.5">Frontend-разработчик</Text>
					<div className={styles.TimeLine}>
						<Timeline active={1} bulletSize={24} lineWidth={2}>
							<Timeline.Item title="Middle, текущий уровень">
								<Button variant="light">120 т.р.</Button>
							</Timeline.Item>
							<Timeline.Item title="Senior" lineVariant="dashed">
								<Button variant="light">200+ т.р.</Button>
								<Text fz="md" mt={6} fw={500}>
									Что необходимо изучить:
								</Text>
								<List withPadding>
									<List.Item>архитектуру ПО</List.Item>
									<List.Item>паттерны проектирования</List.Item>
								</List>
								<Text fz="md" mt={6} fw={500}>
									Что необходимо сделать:
								</Text>
								<List withPadding>
									<List.Item>
										закончить проект “Рога и Копыта”
									</List.Item>
									<List.Item>
										пройти техническое интервью у старшего
										разработчика
									</List.Item>
								</List>
							</Timeline.Item>
							<Timeline.Item title="Тимлид">
								<Button variant="light">200+ т.р.</Button>
								<Text fz="md" mt={6} fw={500}>
									Что необходимо изучить:
								</Text>
								<List withPadding>
									<List.Item>курс по управлению персоналом</List.Item>
								</List>
								<Text fz="md" mt={6} fw={500}>
									Что необходимо сделать:
								</Text>
								<List withPadding>
									<List.Item>
										продемонстрировать управленческие навыки
									</List.Item>
									<List.Item>
										зарекомендовать себя надежным соратником для
										коллег
									</List.Item>
								</List>
							</Timeline.Item>
						</Timeline>
					</div>
				</Stack>
			</Container>
		</>
	)
}

CareerPage.getLayout = function getLayout(page) {
	return <BaseLayout>{page}</BaseLayout>
}

export default CareerPage
