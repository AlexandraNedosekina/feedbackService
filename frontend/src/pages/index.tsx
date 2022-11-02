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
				{/* <Image src={}/> */}
				<div className="header_info">
					<Title className="header_title">Feedback Service</Title>
					<Text className="header_text">
						{' '}
						Сервис для взаимооценивания сотрудников, направленный на
						повышение эффективности.
					</Text>
					<Center>
						<Button
							className="button_login"
							leftIcon={<IconBrandGitlab size={22} color="#3B82BF" />}
							variant="outline"
						>
							Войти через Git
						</Button>
					</Center>
				</div>
				<div>
					<span className="text_left">
						<Title> Оценивай коллег</Title>
						<Text size="md">
							Поставь оценку по критериям, напиши, что понравилось, а что
							не очень.
						</Text>
					</span>
					{/* <Image src="rat1.svg" alt='rate1'/> */}
				</div>
				<div>
					<span className="text_right">
						<Title> Узнай, что нужно для карьерного роста</Title>
						<Text size="md">
							{' '}
							Рекомендации от руководства, необходимые достижения и
							выполненные задачи{' '}
						</Text>
					</span>
				</div>
				<div>
					<span className="text_left_two">
						<Title> Назначай личные встречи</Title>
						<Text size="md">
							Можно посмотреть график встреч коллеги и выбрать подходящее
							время
						</Text>
					</span>
				</div>
				<div className="contacts">support@email.com</div>
			</SimpleGrid>
		</Container>
	)
}

Home.getLayout = function getLayout(page: ReactElement) {
	return <BaseLayout>{page}</BaseLayout>
}

export default Home
