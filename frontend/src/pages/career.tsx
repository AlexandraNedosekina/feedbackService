import { Badge, Container, Text, Title } from '@mantine/core'
import Head from 'next/head'
import { BaseLayout } from 'src/layouts'
import styles from 'src/styles/career.module.sass'
import { NextPageWithLayout } from './_app'

const CareerPage: NextPageWithLayout = () => {
	return (
		<>
			<Head>
				<title>Карьерный рост</title>
			</Head>
			<Container>
				<Title order={2}>Карьерный рост</Title>

				<Title order={4} color="brand" mt="md">
					Frontend-разработчик
				</Title>

				<div className={styles.timeline}>
					<div className={styles.timeline_item}>
						<div
							className={styles.timeline_item_content}
							data-line-active
						>
							<Title order={4} color="brand.6">
								Middle, текущий уровень
							</Title>

							<Badge mt="sm">120 т.р.</Badge>
							<div className={styles.timeline_bullet} data-active></div>
						</div>
						<div className={styles.timeline_item_span}></div>
					</div>
					<div className={styles.timeline_item}>
						<div className={styles.timeline_item_span}></div>
						<div className={styles.timeline_item_content}>
							<Title order={4} color="brand.6">
								Senior
							</Title>

							<Badge mt="sm">200+ т.р.</Badge>

							<Text fz="md" mt={'md'} fw={500}>
								Что необходимо изучить:
							</Text>
							<ul>
								<li>архитектуру ПО</li>
								<li>паттерны проектирования</li>
							</ul>
							<Text fz="md" mt={6} fw={500}>
								Что необходимо сделать:
							</Text>
							<ul>
								<li>закончить проект “Рога и Копыта”</li>
								<li>
									пройти техническое интервью у старшего разработчика
								</li>
							</ul>
							<div className={styles.timeline_bullet}></div>
						</div>
					</div>
					<div className={styles.timeline_item}>
						<div className={styles.timeline_item_content}>
							<Title order={4} color="brand.6">
								Тимлид
							</Title>

							<Badge mt="sm">200+ т.р.</Badge>

							<Text fz="md" mt={'md'} fw={500}>
								Что необходимо изучить:
							</Text>
							<ul>
								<li>курс по управлению персоналом</li>
							</ul>

							<Text fz="md" mt={6} fw={500}>
								Что необходимо сделать:
							</Text>
							<ul>
								<li>продемонстрировать управленческие навыки</li>
								<li>
									зарекомендовать себя надежным соратником для коллег
								</li>
							</ul>

							<div className={styles.timeline_bullet}></div>
						</div>
						<div className={styles.timeline_item_span}></div>
					</div>
				</div>
			</Container>
		</>
	)
}

CareerPage.getLayout = function getLayout(page) {
	return <BaseLayout>{page}</BaseLayout>
}

export default CareerPage
