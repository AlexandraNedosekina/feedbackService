import {
	Button,
	Center,
	Container,
	Group,
	SimpleGrid,
	Text,
	Title,
} from '@mantine/core'
import { useMutation } from '@tanstack/react-query'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { signinGitlab } from 'shared/api'
import styles from './styles.module.scss'

export const MainPage = () => {
	const router = useRouter()

	function onSignInSuccess(url: string) {
		router.push(url)
	}

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

			<div className={styles.hero}>
				<Group position="apart" className={styles.hero_header}>
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

			<Container className={styles.content} pt={60} pb="md">
				<SimpleGrid cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
					<div className={styles.content_description}>
						<Title>Оценивай коллег</Title>
						<Text className={styles.content_text}>
							Оценка деятельности сотрудников, получение обратной связи
							от коллег.
						</Text>
					</div>
					<div className={styles.content_image}>
						<Image src={'/rat1.svg'} layout="fill" alt="" />
					</div>
				</SimpleGrid>

				<Center>
					<Image src={'/line.svg'} width={260} height={120} alt="" />
				</Center>

				<SimpleGrid cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
					<div className={styles.content_image}>
						<Image src={'/career-grown.svg'} layout="fill" alt="" />
					</div>
					<div className={styles.content_description}>
						<Title>Следи за возможностью карьерного роста</Title>
						<Text className={styles.content_text}>
							Рекомендации от руководства, цели и задачи, необходимые для
							повышения уровня заработной платы
						</Text>
					</div>
				</SimpleGrid>

				<Center>
					<Image src={'/line2.svg'} width={210} height={140} alt="" />
				</Center>

				<SimpleGrid cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
					<div className={styles.content_description}>
						<Title>Назначай личные встречи</Title>
						<Text className={styles.content_text}>
							Составление расписания, отслеживание занятности коллег,
							возможность назначить встречу
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
