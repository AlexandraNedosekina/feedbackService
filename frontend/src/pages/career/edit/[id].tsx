import { CareerChips } from '@components/AdminCareer/components'
import { Avatar, Container, Group, Stack, Text, Title } from '@mantine/core'
import Head from 'next/head'
import { BaseLayout } from 'src/layouts'
import { NextPageWithLayout } from 'src/pages/_app'

const EditCareerPage: NextPageWithLayout = () => {
	return (
		<>
			<Head>
				<title>Редактирование карьерного роста</title>
			</Head>

			<Container pt="lg">
				<Title order={2}>Редактирование карьерного роста</Title>

				<Group mt="xl">
					<Avatar
						src={
							null
							// data
							// 	? `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${data.receiver.id}/avatar`
							// 	: null
						}
						size={64}
						radius={100}
					/>
					<Stack spacing={5}>
						<Title order={2} color="brand.5">
							Name Surname
						</Title>
						<Text color="brand.5">Fullstack</Text>
					</Stack>
				</Group>

				<CareerChips />
			</Container>
		</>
	)
}

EditCareerPage.getLayout = function getLayout(page) {
	return <BaseLayout>{page}</BaseLayout>
}

export default EditCareerPage
