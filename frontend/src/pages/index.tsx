import {
	Button,
	Container,
	Footer,
	Group,
	SimpleGrid,
	Text,
	Title,
} from '@mantine/core'
import { useMutation } from '@tanstack/react-query'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { signinGitlab } from 'src/api'
import styles from 'src/styles/main.module.scss'
import { NextPageWithLayout } from './_app'

const Home: NextPageWithLayout = () => {
	const router = useRouter()

	const onSignInSuccess = useCallback((url: string) => {
		router.push(url)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const { mutate: signInHeader, isLoading: isLoadingHeader } = useMutation({
		mutationFn: signinGitlab,
		onSuccess: data => onSignInSuccess(data.authorize_url),
	})

	const { mutate: signInHero, isLoading: isLoadingHero } = useMutation({
		mutationFn: signinGitlab,
		onSuccess: data => onSignInSuccess(data.authorize_url),
	})

	return (
		<>
			<Head>
				<title>Главная</title>
			</Head>

			{/* 
				Здесь и далее будет использован css modules (https://nextjs.org/docs/basic-features/built-in-css-support#adding-component-level-css),
				чтобы классы не были глобальными и использовались только в рамках этой страницы.
				Импортирован выше import styles from 'src/styles/main.module.scss'

				Для использования класса, нужно прописать className={styles.название_класса} или className={styles['название_класса']}
			
				Обычно приветственный блок называется hero
			 */}
			<div className={styles.hero}>
				{/* 
					Group - flex компонент, весьма удобно, не нужно самому прописывать display: flex и прочие justify-content и align-items.
					В данном случае, у нас изображение и ссылка, по макету они в разных сторонах, и нам нужен justify-content: space-between, что равняется пропсу position='apart' в Group
				 */}
				<Group position="apart" className={styles.hero_header}>
					{/* 
						https://nextjs.org/docs/basic-features/image-optimization
						Image - специальный компонент next.js, который оптимизирует статичные изображения при билде, конвертирует их в webp
					 */}
					<Image
						src="/logo-blue.svg"
						width={91}
						height={37}
						alt="Feedback service 66bit"
					/>
					<Button
						onClick={() => signInHeader()}
						loading={isLoadingHeader}
						variant="subtle"
						sx={() => ({
							fontSize: '16px',
						})}
					>
						Войти
					</Button>
				</Group>

				{/* 
					Здесь блок с контентом hero
				 */}
				<div className={styles.hero_content}>
					<Title color="brand.6" size={48}>
						Feedback Service
					</Title>
					<Text color="brand.6" mt="xl" size={'xl'}>
						Сервис для взаимооценивания сотрудников, направленный на
						повышение эффективности.
					</Text>
					<Button
						onClick={() => signInHero()}
						loading={isLoadingHero}
						leftIcon={
							// Импортировал картинку из макета, чтобы совпадало. Width и height тоже из макета
							<Image
								src="/gitlab-logo.svg"
								width={22}
								height={21}
								alt=""
							/>
						}
						variant="outline"
						mt={90}
						size="md"
					>
						Войти через Git
					</Button>
				</div>
			</div>

			{/* 
				Идет основной контент страницы.

				Container для padding, который уже адаптирован под разные разрешения экрана
			 */}
			<Container className={styles.content} py={60}>
				{/* 
					SimpileGrid имеет 'display: grid', в нашем случае 2 колонки при ширине экрана 768px (sm) и больше, и 1 колонка при ширине экрана меньше 768px.

					content_image имеет 'display: none' при 768px и меньше.
				 */}
				<SimpleGrid cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
					<div className={styles.content_description}>
						<Title>Оценивай коллег</Title>
						<Text className={styles.content_text}>
							Поставь оценку по критериям, напиши, что понравилось, а что
							не очень.
						</Text>
					</div>
					<div className={styles.content_image}>
						{/* 
							layout='fill', чтобы не прописывать width и height.
							В таком случае изображение будет занимать все место родителя с 'position: relative'
						 */}
						<Image src={'/rat1.svg'} layout="fill" alt="" />
					</div>
					<div className={styles.content_line}>
						<Image src={'/line1.svg'} layout="fill" alt="" />
					</div>
				</SimpleGrid>
				<SimpleGrid cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
					<div className={styles.content_image}>
						<Image src={'/career-grown.svg'} layout="fill" alt="" />
					</div>
					<div className={styles.content_description}>
						<Title>Узнай, что нужно для карьерного роста</Title>
						<Text className={styles.content_text}>
							Рекомендации от руководства, необходимые достижения и
							выполненные задачи
						</Text>
					</div>
					<div className={styles.content_line_t}>
						<Image src={'/line2.svg'} layout="fill" alt="" />
					</div>
				</SimpleGrid>
				<SimpleGrid cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
					<div className={styles.content_description}>
						<Title>Назначай личные встречи</Title>
						<Text className={styles.content_text}>
							Можно посмотреть график встреч коллеги и выбрать подходящее
							время
						</Text>
					</div>
					<div className={styles.content_image}>
						<Image src={'/calendar.svg'} layout="fill" alt="" />
					</div>
				</SimpleGrid>

				<footer>
					<Text align="center">support@email.com</Text>
				</footer>
			</Container>
		</>
	)
}

export default Home
