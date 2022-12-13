import { Badge, Container, Text, Title } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import Head from 'next/head'
import { getMyCareer, QueryKeys } from 'src/api'
import { BaseLayout } from 'src/layouts'
import styles from 'src/styles/career.module.sass'
import { useUser } from 'src/utils/useUser'
import { NextPageWithLayout } from './_app'

const CareerPage: NextPageWithLayout = () => {
	const { data, isLoading } = useQuery({
		queryKey: [QueryKeys.CAREER],
		queryFn: getMyCareer,
	})
	const { user } = useUser()

	return (
		<>
			<Head>
				<title>Карьерный рост</title>
			</Head>
			<Container pt="lg">
				<Title order={2}>Карьерный рост</Title>

				{user?.job_title && (
					<Title order={4} color="brand" mt="md">
						{user.job_title}
					</Title>
				)}

				{isLoading && <Text mt="md">Загрузка...</Text>}

				{data && data?.length === 0 && (
					<Text mt="md">
						На данный момент у вас нет карьерного плана. Обратитесь к
						руководителю.
					</Text>
				)}

				{data && data?.length > 0 && (
					<div className={styles.timeline}>
						{data?.map((item, i) => (
							<div className={styles.timeline_item} key={item.id}>
								{i % 2 !== 0 && (
									<div className={styles.timeline_item_span}></div>
								)}

								<div
									className={styles.timeline_item_content}
									data-line-active={item.is_current}
								>
									<Title order={4} color="brand.6">
										{item.name}
										{item.is_current && ', текущий уровень'}
									</Title>

									{/* <Badge mt="sm">120 т.р.</Badge> */}

									{!item.is_current && (
										<>
											{item.toLearn.length > 0 && (
												<>
													<Text fz="md" mt={'md'} fw={500}>
														Что необходимо изучить:
													</Text>
													<ul>
														{item.toLearn.map(item => (
															<li key={item.id}>
																{item.description}
															</li>
														))}
													</ul>
												</>
											)}
											{item.toComplete.length > 0 && (
												<>
													<Text fz="md" mt={6} fw={500}>
														Что необходимо сделать:
													</Text>
													<ul>
														{item.toComplete.map(item => (
															<li key={item.id}>
																{item.description}
															</li>
														))}
													</ul>
												</>
											)}
										</>
									)}

									<div
										className={styles.timeline_bullet}
										data-active={item.is_current}
									></div>
								</div>

								{i % 2 === 0 && (
									<div className={styles.timeline_item_span}></div>
								)}
							</div>
						))}
					</div>
				)}
			</Container>
		</>
	)
}

CareerPage.getLayout = function getLayout(page) {
	return <BaseLayout>{page}</BaseLayout>
}

export default CareerPage
