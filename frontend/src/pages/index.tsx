import {
	Button,
	Container,
	SimpleGrid,
	Title,
	Image,
	Center,
	Text,
} from '@mantine/core'
import Head from 'next/head'
import { ReactElement } from 'react'
import { BaseLayout } from 'src/layouts'
import { NextPageWithLayout } from './_app'
import { IconBrandGitlab } from '@tabler/icons'

const Home: NextPageWithLayout = () => {
	return (
		<Container>
			<Head>
				<title>Главная</title>
			</Head>
			<SimpleGrid cols={1}>
				<article className="card">
					<div className="card_thumb">
						<Image src="main.png" alt="background" />
					</div>
					<div className="card_content">
						<Title>Feedback Service</Title>
						<a>
							Сервис для взаимооценивания сотрудников, направленный на
							повышение эффективности.
						</a>
						<div className="git_button">
							<Button
								leftIcon={<IconBrandGitlab size={22} color="#3B82BF" />}
								variant="outline"
							>
								Войти через Git
							</Button>
						</div>
					</div>
				</article>
				<article className="card">
					<span className="text_left">
						<Title> Оценивай коллег</Title>
						<Text size="md">
							Поставь оценку по критериям, напиши, что понравилось, а что
							не очень.
						</Text>
					</span>
					<Image
						className="rate1"
						src="rat1.svg"
						alt="rate1"
						width={256}
						height={256}
						fit="contain"
					/>
					<Image
						className="line1"
						src="line1.svg"
						alt="line1"
						width={416}
						height={228}
					/>
				</article>
				<article className="card">
					<span className="text_right">
						<Title> Узнай, что нужно для карьерного роста</Title>
						<Text size="md">
							{' '}
							Рекомендации от руководства, необходимые достижения и
							выполненные задачи{' '}
						</Text>
					</span>
					<Image
						className="career-grown"
						src="career-grown.svg"
						alt="rate2"
						width={256}
						height={256}
						fit="contain"
					/>
					<Image
						className="line2"
						src="line2.svg"
						alt="line2"
						width={285}
						height={217}
					/>
				</article>
				<article className="card">
					<span className="text_left_two">
						<Title> Назначай личные встречи</Title>
						<Text size="md">
							Можно посмотреть график встреч коллеги и выбрать подходящее
							время
						</Text>
					</span>
					<Image
						className="calendar"
						src="calendar.svg"
						alt="rate2"
						width={256}
						height={256}
						fit="contain"
					/>
				</article>
			</SimpleGrid>
		</Container>
	)
}

Home.getLayout = function getLayout(page: ReactElement) {
	return <BaseLayout>{page}</BaseLayout>
}

export default Home
